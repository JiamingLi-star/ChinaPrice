import logging
import re

logger = logging.getLogger(__name__)

MODEL_PATTERN = re.compile(
    r"\b([A-Z]{1,5}[\-]?[A-Z0-9]{1,10}[\-]?[A-Z0-9]*)\b", re.IGNORECASE
)

BRAND_PATTERN = re.compile(r"^([A-Z][a-zA-Z0-9]+)")

FILLER_WORDS = frozenset({
    "new", "hot", "sale", "free", "shipping", "original",
    "genuine", "official", "latest", "best", "top", "quality",
    "premium", "wholesale", "retail", "stock", "ready",
    "2024", "2025", "2026",
})

JACCARD_THRESHOLD = 0.65


class ProductMatcher:
    """Two-layer product matching: rule-based then text-similarity."""

    def match(self, products: list[dict]) -> list[dict]:
        if not products:
            return []

        groups: list[list[dict]] = []

        for product in products:
            group_idx = self._find_group(product, groups)
            if group_idx is not None:
                groups[group_idx].append(product)
            else:
                groups.append([product])

        for group_idx, group in enumerate(groups):
            for product in group:
                product["canonical_group"] = group_idx

        flat = [p for group in groups for p in group]
        logger.info(
            "Matched %d products into %d groups", len(flat), len(groups)
        )
        return flat

    def _find_group(
        self, product: dict, groups: list[list[dict]]
    ) -> int | None:
        title = product.get("title", "")
        brand = self._extract_brand(title)
        model = self._extract_model(title)

        for idx, group in enumerate(groups):
            for member in group:
                member_title = member.get("title", "")

                if brand and model:
                    m_brand = self._extract_brand(member_title)
                    m_model = self._extract_model(member_title)
                    if (
                        m_brand
                        and m_model
                        and brand.lower() == m_brand.lower()
                        and model.lower() == m_model.lower()
                    ):
                        product["match_confidence"] = 1.0
                        return idx

                score = self._jaccard_similarity(
                    self._normalize_title(title),
                    self._normalize_title(member_title),
                )
                if score > JACCARD_THRESHOLD:
                    product["match_confidence"] = round(score, 4)
                    return idx

        return None

    def _extract_brand(self, title: str) -> str | None:
        m = BRAND_PATTERN.search(title.strip())
        if m:
            candidate = m.group(1)
            if len(candidate) >= 2 and not candidate.isdigit():
                return candidate
        return None

    def _extract_model(self, title: str) -> str | None:
        candidates = MODEL_PATTERN.findall(title)
        for c in candidates:
            if any(ch.isdigit() for ch in c) and any(ch.isalpha() for ch in c):
                return c
        return None

    def _normalize_title(self, title: str) -> str:
        text = title.lower()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        words = text.split()
        words = [w for w in words if w not in FILLER_WORDS and len(w) > 1]
        return " ".join(words)

    def _jaccard_similarity(self, a: str, b: str) -> float:
        set_a = set(a.split())
        set_b = set(b.split())
        if not set_a or not set_b:
            return 0.0
        intersection = set_a & set_b
        union = set_a | set_b
        return len(intersection) / len(union)

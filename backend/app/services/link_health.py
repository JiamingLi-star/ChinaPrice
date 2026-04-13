import logging
from datetime import datetime, timezone

import httpx

logger = logging.getLogger(__name__)

PLATFORM_DOMAINS = {
    "taobao": "taobao.com",
    "jd": "jd.com",
    "1688": "1688.com",
    "pinduoduo": "pinduoduo.com",
}

HEALTHY_STATUS_CODES = {200, 301, 302, 303, 307, 308}


class LinkHealthChecker:
    def __init__(self, timeout: float = 10.0, max_concurrent: int = 20):
        self.timeout = timeout
        self.max_concurrent = max_concurrent

    async def check_url(self, url: str) -> dict:
        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
                headers={"User-Agent": "Mozilla/5.0 (compatible; ChinaPrice/1.0)"},
            ) as client:
                resp = await client.head(url)
                is_healthy = resp.status_code in HEALTHY_STATUS_CODES
                return {
                    "url": url,
                    "status_code": resp.status_code,
                    "healthy": is_healthy,
                    "checked_at": datetime.now(timezone.utc).isoformat(),
                }
        except httpx.TimeoutException:
            logger.warning("Timeout checking URL: %s", url)
            return {
                "url": url,
                "status_code": None,
                "healthy": False,
                "error": "timeout",
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
        except Exception as e:
            logger.warning("Error checking URL %s: %s", url, str(e))
            return {
                "url": url,
                "status_code": None,
                "healthy": False,
                "error": str(e),
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }

    async def check_batch(self, urls: list[str]) -> list[dict]:
        import asyncio

        semaphore = asyncio.Semaphore(self.max_concurrent)

        async def _check_with_semaphore(url: str) -> dict:
            async with semaphore:
                return await self.check_url(url)

        tasks = [_check_with_semaphore(url) for url in urls]
        return await asyncio.gather(*tasks)

    def compute_platform_health(self, results: list[dict]) -> dict:
        platform_stats: dict[str, dict] = {}

        for result in results:
            url = result.get("url", "")
            platform = "unknown"
            for pname, domain in PLATFORM_DOMAINS.items():
                if domain in url:
                    platform = pname
                    break

            if platform not in platform_stats:
                platform_stats[platform] = {"total": 0, "healthy": 0, "unhealthy": 0}

            platform_stats[platform]["total"] += 1
            if result.get("healthy"):
                platform_stats[platform]["healthy"] += 1
            else:
                platform_stats[platform]["unhealthy"] += 1

        alerts = []
        for platform, stats in platform_stats.items():
            if stats["total"] > 0:
                failure_rate = stats["unhealthy"] / stats["total"]
                stats["failure_rate"] = round(failure_rate, 4)
                if failure_rate > 0.10:
                    alerts.append(
                        f"ALERT: {platform} has {failure_rate:.1%} link failure rate "
                        f"({stats['unhealthy']}/{stats['total']} links dead)"
                    )
                    logger.error(alerts[-1])

        return {"platforms": platform_stats, "alerts": alerts}

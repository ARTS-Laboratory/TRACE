import logging
import torch
import time

logging.basicConfig(level=logging.INFO,
                     format='%(asctime)s - %(levelname)s - %(message)s',
                     datefmt='%Y-%m-%d %I:%M:%S %p')

logging.getLogger().setLevel(logging.WARNING)

# Ollama client
logging.getLogger("httpx").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)



def giveGPUstatus() -> None:
        logger.info("=" * 50)
        logger.info(f"torch: {torch.__version__}")
        logger.info(f"hip: {torch.version.hip}")
        logger.info(f"cuda available: {torch.cuda.is_available()}")

        if not torch.cuda.is_available():
                raise SystemExit("ROCm GPU is not visible to PyTorch")

        device = "cuda"
        logger.info(f"device: {torch.cuda.get_device_name(0)}")

        x = torch.randn((4096, 4096), device=device, dtype=torch.float16)
        y = torch.randn((4096, 4096), device=device, dtype=torch.float16)

        torch.cuda.synchronize()
        start = time.time()

        for _ in range(20):
                z = x @ y

        torch.cuda.synchronize()
        logger.info(f"seconds: {round(time.time() - start, 3)}")
        logger.info(f"ok: {z.shape}, {z.dtype}")
        logger.info(f"{'=' * 50}\n")

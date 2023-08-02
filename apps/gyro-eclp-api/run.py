import os

import uvicorn


def run():
    uvicorn.run(
        "gyro_eclp_api:app",
        reload=True,
        port=int(os.getenv("PORT", 8000)),
        host="0.0.0.0",
    )


if __name__ == "__main__":
    run()

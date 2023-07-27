import uvicorn


def run():
    uvicorn.run("gyro_eclp_api:app", reload=True)


if __name__ == "__main__":
    run()

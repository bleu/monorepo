import uvicorn


def run():
    uvicorn.run("pool_simulator_api:app", reload=True)


if __name__ == "__main__":
    run()

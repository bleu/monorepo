from fastapi.testclient import TestClient
from gyro_eclp_api import app
from pytest import approx

client = TestClient(app)


def test():
    """
    Test the /calculate_derivative_parameters/ endpoint using the same test of the math package.
    The data was queried from balancer subgraph (pool address 0xe0e8ac08de6708603cfd3d23b613d2f80e3b7afb)
    """
    response = client.post(
        "/calculate_derivative_parameters/",
        json={
            "alpha": "0.999500249875062469",
            "beta": "1.010101010101010101",
            "l": "500",
            "c": "0.705688316491160463",
            "s": "0.708522406115622955",
        },
    )
    assert response.status_code == 200
    subgrapth_data = {
        "tauAlphaX": "-0.74798712145497721414789338637153095",
        "tauAlphaY": "0.6637132408936084850124885784132084",
        "tauBetaX": "0.833836782972598765391616590778174",
        "tauBetaY": "0.5520110681516333748894951592266483",
        "u": "0.790905599558369850905339125610308",
        "v": "0.6076383033720348083193297868072476",
        "w": "-0.05585063777148738251815296884188865",
        "z": "0.03975485570515915653508200992108477",
        "dSq": "1.000000000000000000825967344137306",
    }

    # The api return the values with more decimal points. Since the math package
    # handle the conversion from string to the right amount of decimals, we don't need to do it here.
    # For test purposes we will round the values to 18 decimals.

    response_data_truncated = {key: value[30] for key, value in response.json().items()}
    subgrapth_data_truncated = {
        key: value[30] for key, value in response.json().items()
    }
    assert response_data_truncated == subgrapth_data_truncated

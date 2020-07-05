import axios from "axios";
import * as types from "./inputTypes";

export const getItems = () => async (dispatch) => {
  dispatch({ type: types.FETCH_INPUT_REQUEST_GET, input: "All" });
  console.log("requested");

  axios
    .get("http://127.0.0.1:8000/api/items/")
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: types.FETCH_INPUT_SUCCESS_GET,
        payload: { data: res.data, input: res.data[0].input },
      });
    })
    .catch((err) =>
      dispatch({
        type: types.FETCH_INPUT_ERROR_GET,
        payload: err,
      })
    );
};

export const getInput = (input) => async (dispatch) => {
  dispatch({ type: types.FETCH_INPUT_REQUEST_GET, input });
  console.log("GET requested");
  let inputCreatedAt = "";
  axios
    .get(`http://127.0.0.1:8000/api/inputs/?search=${input}`)
    .then((res) => {
      // console.log(`Input: ${inputCreatedAt}`);
      inputCreatedAt = res.data.filter((search) => {
        return search.input === input;
      })[0].created_at;
      // console.log(`Input: ${inputCreatedAt}`);
    })
    .catch((err) => (inputCreatedAt = ""));

  axios
    .get(`http://127.0.0.1:8000/api/items/?ordering=price&search=${input}`)
    .then((res) => {
      dispatch({
        type: types.FETCH_INPUT_SUCCESS_GET,
        input,
        createdAt: inputCreatedAt,
        payload: { data: res.data },
      });
    })

    .catch((err) =>
      dispatch({
        type: types.FETCH_INPUT_ERROR_GET,
        input,
        payload: err,
      })
    );
  console.log("GET finished");
};

export const postInput = (input) => async (dispatch) => {
  dispatch({ type: types.FETCH_INPUT_REQUEST_POST, input });
  console.log("POST requested");

  axios
    .post(
      `http://127.0.0.1:8000/api/inputs/`,
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) =>
      dispatch({
        type: types.FETCH_INPUT_SUCCESS_POST,
        input,
        createdAt: res.data.created_at,
        inputID: res.data.id,
      })
    )
    .catch((err) =>
      dispatch({
        type: types.FETCH_INPUT_ERROR_POST,
        input,
        payload: err,
      })
    );
  // console.log("POST finished");
  // getInput(input);
};

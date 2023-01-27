import { Configuration, OpenAIApi } from "openai";
import React, { useCallback, useEffect, useState } from "react";
import { AI_API_KEY } from "./process";
import { BsLightbulbFill } from "react-icons/bs";
import ClockLoader from "react-spinners/ClockLoader";

const App = () => {
  const configuration = new Configuration({
    apiKey: AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const [mainLoad, setMainLoad] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setMainLoad(true);
    }, 2000);
  }, []);

  const brain = useCallback(() => {
    setColor((pre) => !pre);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const timeColor = setInterval(brain, 300);
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 100,
      });
      setQuestion(prompt);
      setResult(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setPrompt("");
    clearInterval(timeColor);
    setColor(false);
  };
  return (
    <>
      {mainLoad ? (
        <div className="container pt-5">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center gap-3">
                {color ? (
                  <BsLightbulbFill size={25} className="text-danger" />
                ) : (
                  <BsLightbulbFill size={25} className="text-secondary" />
                )}
                <h4 className="mb-0 fs-2">Chat LTT</h4>
              </div>
            </div>
            <div className="col-12 col-lg-6 mx-auto mt-3">
              <form action="" onSubmit={handleSubmit}>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="3"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="form-control"
                  placeholder="Write your questions ..."
                  required
                ></textarea>
                <button type="submit" className="btn btn-primary mt-3">
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
              </form>
              {
                result && ( <div>
                  <p className="text-muted mt-3 mb-0"><span className="text-dark">Qn</span> --- {question}</p>
                  <hr />
                  <p className="text-muted mt-2 mb-1"><span className="text-dark">Ans</span> --- {result}</p>
                </div> )
              }
            </div>
          </div>
        </div>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ width: "100%", height: "100vh" }}
        >
          <ClockLoader color="#36d7b7" />
          <p className="mb-0 mt-3 text-muted">Now, I am busy</p>
          <p className="text-muted">Please wait a few seconds</p>
        </div>
      )}
    </>
  );
};

export default App;

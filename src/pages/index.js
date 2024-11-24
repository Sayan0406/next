"use client";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import c from "highlight.js/lib/languages/c";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";

export default function Home() {
  const elementRef = useRef(null);
  const preRef = useRef(null);
  const [theme, setTheme] = useState("");
  const [darkToggle, setDarkToggle] = useState(true);
  const [inputText, setInputText] = useState("");
  const [dynamicPadding, setDynamicPadding] = useState("64");
  const [backgroundColor, setBackgroundColor] = useState(
    "linear-gradient(140deg, rgb(255, 99, 99), rgb(115, 52, 52))"
  );
  const [language, setLanguage] = useState("javascript");
  const [fontColor, setFontColor] = useState(darkToggle ? "white" : "black");
  const [undoStack, setUndoStack] = useState([]); // Track undo history
  const [redoStack, setRedoStack] = useState([]); // Track redo history

  const handlePadding = (event) => {
    const { value } = event.target;
    setDynamicPadding(value);
  };

  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    autoResize();
  }, [inputText]);

  const formatTextarea = () => {
    let highlightedCode;
    switch (language) {
      case "cpp":
        hljs.registerLanguage("cpp", cpp);
        highlightedCode = hljs.highlight(inputText, { language: "cpp" }).value;
        break;
      case "c":
        hljs.registerLanguage("c", c);
        highlightedCode = hljs.highlight(inputText, { language: "c" }).value;
        break;
      case "java":
        hljs.registerLanguage("java", java);
        highlightedCode = hljs.highlight(inputText, { language: "java" }).value;
        break;
      case "python":
        hljs.registerLanguage("python", python);
        highlightedCode = hljs.highlight(inputText, { language: "python" }).value;
        break;
      default:
        hljs.registerLanguage("javascript", javascript);
        highlightedCode = hljs.highlight(inputText, { language: "javascript" }).value;
    }
    return (
      <pre
        className="Editor_formatted__x4nkp hljs hljs-rest crimsonTheme"
        ref={preRef}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      ></pre>
    );
  };

  function autoResize() {
    const textarea2 = document.getElementById("myTextarea2");
    textarea2.style.height = "auto";
    textarea2.style.height = textarea2.scrollHeight + "px";
  }

  const themeChange = (value) => {
    const preElement = document.querySelector(
      "pre.Editor_formatted__x4nkp.hljs"
    );
    if (value === "Crimson") {
      preElement.classList.remove("blueTheme", "purpleTheme", "oceanTheme", "sunsetTheme");
      preElement.classList.add("crimsonTheme");
      setBackgroundColor(
        "linear-gradient(140deg, rgb(255, 99, 99), rgb(115, 52, 52))"
      );
    } else if (value === "Purple") {
      preElement.classList.remove("blueTheme", "crimsonTheme", "oceanTheme", "sunsetTheme");
      preElement.classList.add("purpleTheme");
      setBackgroundColor(
        "linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248))"
      );
    } else if (value === "Ocean") {
      preElement.classList.remove("blueTheme", "crimsonTheme", "purpleTheme", "sunsetTheme");
      preElement.classList.add("oceanTheme");
      setBackgroundColor(
        "linear-gradient(140deg, rgba(0,194,255,1) 0%, rgba(255,94,0,1) 100%)"
      );
    } else if (value === "Sunset") {
      preElement.classList.remove("blueTheme", "crimsonTheme", "purpleTheme", "oceanTheme");
      preElement.classList.add("sunsetTheme");
      setBackgroundColor(
        "linear-gradient(140deg, rgba(0,176,255,1) 0%, rgba(255,255,255,1) 100%)"
      );
    } else {
      preElement.classList.remove("purpleTheme", "crimsonTheme", "oceanTheme", "sunsetTheme");
      preElement.classList.add("blueTheme");
      setBackgroundColor(
        "linear-gradient(140deg, rgb(142, 199, 251), rgb(28, 85, 170))"
      );
    }
  };

  const handleColor = (event) => {
    const { value } = event.target;
    setTheme(value);
    themeChange(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const toggleFontColor = () => {
    setFontColor(darkToggle ? "black" : "white");
  };

  const handleClear = () => {
    setInputText(""); // Clear all text
    setUndoStack([]); // Clear undo history
    setRedoStack([]); // Clear redo history
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setRedoStack([inputText, ...redoStack]); // Push the current state to redo stack
      setInputText(lastState); // Set to the last undo state
      setUndoStack(undoStack.slice(0, -1)); // Remove the last undo state
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack([...undoStack, inputText]); // Push the current state to undo stack
      setInputText(nextState); // Set to the next redo state
      setRedoStack(redoStack.slice(1)); // Remove the first redo state
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
    setUndoStack([...undoStack, newText]); // Save the current state to undo stack
  };

  return (
    <div className="flex justify-center items-center mx-auto min-h-screen bg-black">
      <div
        ref={elementRef}
        className={`${
          dynamicPadding === "64"
            ? "p-20"
            : dynamicPadding === "128"
            ? "p-28"
            : dynamicPadding === "32"
            ? "p-14"
            : dynamicPadding === "264"
            ? "p-64"
            // : dynamicPadding === "512"
            // ? "p-128"
            : "p-8"
        } bg-slate-200`}
        style={{
          backgroundImage: `${backgroundColor}`,
        }}
      >
        <div
          className="min-w-max h-content min-h-28 rounded-xl px-2"
          style={{
            backgroundColor: darkToggle ? "rgba(0,0,0,.75)" : "white",
            color: fontColor,
            position: "relative", // To position the resize handle correctly
          }}
        >
          <div className="w-38 h-full pt-4 font-medium text-white flex">
            <div className="w-1/3 flex pl-2 pr-2">
              <div className="w-3 h-3 bg-red-500 rounded-lg mr-1.5"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-lg mr-1.5"></div>
              <div className="w-3 h-3 bg-green-500 rounded-lg mr-1.5"></div>
            </div>
            <div
              className="text-sm w-72 flex justify-center text-slate-400 mr-4"
              contentEditable
              style={{ outline: "none" }}
            >
              untitled-1
            </div>
          </div>
          <div id="myTextarea2" className="Editor_editor__Jz9sW">
            <textarea
              id="myTextarea"
              onInput={(e) => autoResize()}
              value={inputText}
              onChange={handleTextChange}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="off"
              style={{
                resize: "both", // Enable resizing
                overflow: "auto", // Prevent overflow when resizing
                minWidth: "200px", // Minimum width for the textarea
                minHeight: "50px", // Minimum height for the textarea
              }}
            />
            {formatTextarea()}
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard_items">
          <strong className="dashboard_heading">Theme</strong>
          <select
            style={{
              backgroundColor: "#191919",
              color: "#959595",
              border: " 1px solid #959595",
            }}
            onChange={handleColor}
            className="block bg-black w-26 p-1 outline-none text-sm text-gray-900 border border-gray-300 rounded-lg"
          >
            <option value="Purple">Purple</option>
            <option value="Crimson" selected>
              Crimson
            </option>
            <option value="Blue">Blue</option>
          </select>
        </div>
        <div className="dashboard_items">
          <strong className="dashboard_heading">Dark mode</strong>
          <label className="inline-flex items-center cursor-pointer outline-none mt-2">
            <input
              type="checkbox"
              checked={darkToggle}
              onChange={() => {
                setDarkToggle(!darkToggle);
                toggleFontColor(); // Toggle font color when dark mode changes
              }}
              className="sr-only peer outline-none"
            />
            <div className="relative w-9 h-5 outline-none bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="dashboard_items">
          <strong className="dashboard_heading">Padding</strong>
          <div className="mt-2">
            <div className="flex text-sm" style={{ color: "#959595" }}>
              <button
                className={`mr-2 ${dynamicPadding === "16" ? "text-red-400" : ""}`}
                value="16"
                onClick={handlePadding}
              >
                16
              </button>
              <button
                className={`mr-2 ${dynamicPadding === "32" ? "text-red-400" : ""}`}
                value="32"
                onClick={handlePadding}
              >
                32
              </button>
              <button
                className={`mr-2 ${dynamicPadding === "64" ? "text-red-400" : ""}`}
                value="64"
                onClick={handlePadding}
              >
                64
              </button>
              <button
                className={`mr-2 ${dynamicPadding === "128" ? "text-red-400" : ""}`}
                value="128"
                onClick={handlePadding}
              >
                128
              </button>
              <button
                className={`mr-2 ${dynamicPadding === "264" ? "text-red-400" : ""}`}
                value="264"
                onClick={handlePadding}
              >
                264
              </button>
              {/* <button
                className={`mr-2 ${dynamicPadding === "512" ? "text-red-400" : ""}`}
                value="512"
                onClick={handlePadding}
              >
                512
              </button> */}
            </div>
          </div>
        </div>

        <div className="dashboard_items">
          <strong className="dashboard_heading">Language</strong>
          <div className="mt-1">
            <select
              onChange={handleLanguageChange}
              style={{
                backgroundColor: "#191919",
                color: "#959595",
                border: "1px solid #959595",
              }}
              className="block bg-black w-26 p-1 outline-none text-sm text-gray-900 border border-gray-300 rounded-lg"
            >
              <option value="javascript">Javascript</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        <div className="dashboard_items">
          <button
            onClick={handleClear}
            className="bg-red-500 w-20 text-sm p-2 rounded-lg"
          >
            Clear
          </button>
        </div>

        <div className="dashboard_items">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="bg-gray-500 w-20 text-sm p-2 rounded-lg mr-2"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="bg-gray-500 w-20 text-sm p-2 rounded-lg"
          >
            Redo
          </button>
        </div>

        <div className="dashboard_items">
          <button
            onClick={htmlToImageConvert}
            className="bg-red-400 w-20 text-sm p-2 rounded-lg"
          >
            Save!
          </button>
        </div>
      </div>
    </div>
  );
}

const saveButton = document.getElementById("downloadButton");
const popup = document.getElementById("savePopup");
let isPopupOpen = false;

saveButton.addEventListener("click", (e) => {
  isPopupOpen = true;
  popup.style.display = "flex";
  e.stopPropagation();

  const confirmDownloadButton = document.getElementById("confirmDownload");
  const fileNameInput = document.getElementById("fileNameInput");

  const formatInput = document.getElementById("formatInput");

  confirmDownloadButton.addEventListener("click", () => {
    let txtContent;

    if (formatInput.value === "plain") {
      const colors = {};
      Object.keys(elements.colorPickers).forEach((key) => {
        colors[key] = elements.colorPickers[key].value;
      });

      txtContent = Object.entries(colors)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      const blob = new Blob([txtContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNameInput.value + ".txt";
      a.click();
    } else if (formatInput.value === "css") {
      const colors = {};
      Object.keys(elements.colorPickers).forEach((key) => {
        colors[key] = elements.colorPickers[key].value;
      });

      txtContent = Object.entries(colors)
        .map(([key, value]) => `-- ${key}: ${value};`)
        .join("\n");
      const blob = new Blob([txtContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNameInput.value + ".txt";
      a.click();
    } else {
      const colors = {};
      Object.keys(elements.colorPickers).forEach((key) => {
        colors[key] = elements.colorPickers[key].value;
      });

      let txtContent = "colors: { \n";

      txtContent += Object.entries(colors)
        .map(([key, value]) => `  '${key}': '${value}', `)
        .join("\n");

      txtContent += "\n}";

      const blob = new Blob([txtContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNameInput.value + ".txt";
      a.click();
    }
  });
});

document.addEventListener("click", (e) => {
  if (isPopupOpen && !popup.contains(e.target)) {
    popup.style.display = "none";
    isPopupOpen = false;
  }
});

popup.addEventListener("click", (e) => {
  e.stopPropagation();
});

const PRIMARY_ITEM_CLASS = "primaryItem";
const SECONDARY_ITEM_CLASS = "secondaryItem";
const TEXT_ITEM_CLASS = "textItem";
const ACCENT_ITEM_CLASS = "accentItem";
const BACKGROUND_ITEM_CLASS = "backgroundItem";
const INTERPOLATED_ITEM_CLASS = "interpolatedBackground";
const INTERPOLATED_ITEM_SECONDARY_CLASS = "interpolatedBackgroundSecondary";
const INTERPOLATED_ITEM_DARKER_TEXT_CLASS = "interpolatedDarkerText";
const PRIMARY_COLOR_INPUT_ID = "color-input-primary";
const SECONDARY_COLOR_INPUT_ID = "color-input-secondary";
const TEXT_COLOR_INPUT_ID = "color-input-text";
const BACKGROUND_COLOR_INPUT_ID = "color-input-background";
const ACCENT_COLOR_INPUT_ID = "color-input-accent";

const elements = {
  primaryItems: document.getElementsByClassName(PRIMARY_ITEM_CLASS),
  secondaryItems: document.getElementsByClassName(SECONDARY_ITEM_CLASS),
  textItems: document.getElementsByClassName(TEXT_ITEM_CLASS),
  accentItem: document.getElementsByClassName(ACCENT_ITEM_CLASS),
  background: document.getElementsByClassName(BACKGROUND_ITEM_CLASS),
  interpolatedItems: document.getElementsByClassName(INTERPOLATED_ITEM_CLASS),
  colorPickers: {
    primary: document.getElementById(PRIMARY_COLOR_INPUT_ID),
    secondary: document.getElementById(SECONDARY_COLOR_INPUT_ID),
    text: document.getElementById(TEXT_COLOR_INPUT_ID),
    background: document.getElementById(BACKGROUND_COLOR_INPUT_ID),
    accent: document.getElementById(ACCENT_COLOR_INPUT_ID),
  },
};

const colorValues = {
  primary: "#2f27ce",
  background: "#fbfbfe",
  secondary: "#dedcff",
  text: "#050315",
  accent: "#433bff",
};

Object.keys(colorValues).forEach((key) => {
  elements.colorPickers[key].value = colorValues[key];
  updateElements(elements.colorPickers[key], colorValues[key]);
});

function hexToRgb(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("Expected a string but got " + typeof hex);
  }

  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

function interpolateColor(color1, color2, fraction) {
  let rgb1 = hexToRgb(color1);
  let rgb2 = hexToRgb(color2);

  let r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * fraction);
  let g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * fraction);
  let b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * fraction);

  return rgbToHex(r, g, b);
}

function updateInterpolated() {
  const targetElements = Array.from(
    document.getElementsByClassName("interpolatedBackground")
  );

  const primaryColor = colorValues.primary;
  const backgroundColor = colorValues.background;

  const interpolatedColor = interpolateColor(
    primaryColor,
    backgroundColor,
    0.9
  );

  targetElements.forEach((element) => {
    element.style.backgroundColor = interpolatedColor;
  });
}

function updateInterpolatedSecondary() {
  const targetElements = Array.from(
    document.getElementsByClassName("interpolatedBackgroundSecondary")
  );

  const backgroundColor = colorValues.background;
  const secondaryColor = colorValues.secondary;

  // console.log("------ INTERPOLATION SECONDARY -----");

  // console.log("background INTER  ----->     " + backgroundColor);
  // console.log("secondary  INTER  ----->     " + secondaryColor);

  const interpolatedColor = interpolateColor(
    secondaryColor,
    backgroundColor,
    0.7
  );

  // console.log("color      INTER  ----->     " + interpolatedColor);

  targetElements.forEach((element) => {
    element.style.backgroundColor = interpolatedColor;
  });
}

function updateTable() {
  const table = document.querySelectorAll("table");
  const tds = document.querySelectorAll("td");
  const ths = document.querySelectorAll("th");

  table.forEach((element) => {
    element.style.border = "1px solid " + colorValues.accent;
  });

  tds.forEach((element) => {
    element.style.border = "1px solid " + colorValues.accent;
  });

  ths.forEach((element) => {
    element.style.border = "1px solid " + colorValues.accent;
  });
}

function updateElements(colorPicker, newColor) {
  const targetElements = getTargetElements(colorPicker, elements);

  switch (colorPicker) {
    case elements.colorPickers.primary:
      colorValues.primary = elements.colorPickers.primary.value;
      // console.log("primary      ----->   " + colorValues.primary);

      targetElements.forEach((element) => {
        if (element.tagName === "BUTTON") {
          element.style.backgroundColor = newColor;
        }
      });

      updateInterpolated();
      break;
    case elements.colorPickers.background:
      colorValues.background = elements.colorPickers.background.value;
      // console.log("background   ----->   " + colorValues.background);

      targetElements.forEach((element) => {
        if (element.tagName === "BUTTON") {
          element.style.color = newColor;
        } else {
          element.style.backgroundColor = newColor;
        }
      });
      updateInterpolatedSecondary();
      break;

    case elements.colorPickers.secondary:
      colorValues.secondary = elements.colorPickers.secondary.value;
      // console.log("secondary    ----->   " + colorValues.secondary);

      targetElements.forEach((element) => {
        element.style.background = newColor;
      });

      updateInterpolatedSecondary();
      break;

    case elements.colorPickers.accent:
      colorValues.accent = elements.colorPickers.accent.value;

      targetElements.forEach((element) => {
        if (element.tagName === "SPAN") {
          element.style.color = newColor;
        } else if (element.classList.contains("cross-icon")) {
          document.documentElement.style.setProperty("--cross-color", newColor);
        } else {
          element.style.backgroundColor = newColor;
        }
      });
      break;

    case elements.colorPickers.text:
      colorValues.text = elements.colorPickers.text.value;

      targetElements.forEach((element) => {
        if (element.classList.contains("darkerText")) {
          const darkerColor = interpolateColor(
            colorValues.text,
            "#ffffff",
            0.3
          );

          element.style.color = darkerColor;
        } else if (element.classList.contains("img")) {
          element.style.border = "2px solid " + newColor;
        } else {
          element.style.color = newColor;
        }
      });

      break;

    default:
      updateInterpolated();
      updateInterpolatedSecondary();
      break;
  }

  updateTable();
}

function getTargetElements(colorPicker, elements) {
  switch (colorPicker) {
    case elements.colorPickers.primary:
      return Array.from(elements.primaryItems);
    case elements.colorPickers.secondary:
      return Array.from(elements.secondaryItems);
    case elements.colorPickers.background:
      return Array.from(elements.background);
    case elements.colorPickers.text:
      return Array.from(elements.textItems);
    case elements.colorPickers.accent:
      return Array.from(elements.accentItem);
    case elements.colorPickers.interpolatedItems:
      return Array.from(elements.interpolatedItems);
      break;
    case elements.colorPickers.default:
      return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Object.values(elements.colorPickers).forEach((colorPicker) => {
    colorPicker.addEventListener("input", (event) => {
      const newColor = event.target.value;
      updateElements(colorPicker, newColor);
    });
  });
});

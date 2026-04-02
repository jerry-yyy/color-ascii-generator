const STORAGE_KEYS = { language: "color-ascii-language" };

const translations = {
  "zh-CN": {
    documentTitle: "Color ASCII Generator",
    languageToggle: "🇺🇸 EN",
    languageToggleLabel: "切换到英文",
    common: { reset: "重置为默认值", fileName: "ascii-output" },
    hero: {
      eyebrow: "图像与文本双向转换",
      title: "Color ASCII Generator",
      copy: "支持图像转彩色 ASCII，也支持把导出文本重新渲染成图像预览。",
    },
    controls: {
      title: "输入与参数",
      uploadTitle: "拖拽图片到这里，或点击上传",
      uploadSubtitle: "支持 PNG / JPG，透明背景也能直接生成",
      renderMode: "输出模式",
      exportMode: "导出格式",
      charsetPreset: "字符集",
      customCharset: "自定义字符集",
      width: "宽度",
      aspect: "纵横修正",
      brightness: "亮度",
      contrast: "对比度",
      saturation: "饱和度",
      gamma: "Gamma",
      whiteThreshold: "背景判白",
      alphaThreshold: "Alpha 截断",
    },
    options: {
      renderAscii: "经典 ASCII",
      renderBlocks: "半块字符",
      exportAnsi: "True Color ANSI",
      exportHtml: "HTML Export",
      plainText: "纯文本",
      charsetClassic: "Classic",
      charsetDense: "Dense",
      charsetShaded: "Shaded",
      charsetMinimal: "Minimal",
      custom: "自定义",
    },
    toggles: {
      invert: "反转明暗映射",
      trimBackground: "自动清理背景",
      defringe: "去白边",
      fastfetchCompact: "Fastfetch 紧凑导出",
      useColor: "保留颜色",
      showBackground: "显示浅色背景",
    },
    preview: {
      title: "图像转文本",
      copy: "复制输出",
      download: "下载文本",
      waiting: "上传图片后，这里会显示统计信息。",
      output: "导出内容",
    },
    import: {
      title: "文本转图像",
      useCurrent: "使用当前导出",
      render: "渲染文本",
      input: "输入内容",
      uploadTitle: "上传 TXT / ANSI / HTML 文件",
      uploadSubtitle: "也可以直接粘贴导出内容，再渲染成图像预览",
    },
    stats: {
      source: "原图",
      sample: "采样",
      characters: "可见字符",
      visible: "图像范围",
      export: "导出范围",
    },
    alerts: {
      importReadFailed: "读取文本文件失败，请重试。",
      copyFailed: "复制输出失败，请重试。",
    },
  },
  en: {
    documentTitle: "Color ASCII Generator",
    languageToggle: "🇨🇳 中文",
    languageToggleLabel: "Switch to Chinese",
    common: { reset: "Reset to default", fileName: "ascii-output" },
    hero: {
      eyebrow: "Image and Text, Both Ways",
      title: "Color ASCII Generator",
      copy: "Convert images into colored ASCII, or render exported text back into an image preview.",
    },
    controls: {
      title: "Input & Settings",
      uploadTitle: "Drop an image here, or click to upload",
      uploadSubtitle: "PNG / JPG supported, including transparent backgrounds",
      renderMode: "Render mode",
      exportMode: "Export format",
      charsetPreset: "Charset",
      customCharset: "Custom charset",
      width: "Width",
      aspect: "Aspect correction",
      brightness: "Brightness",
      contrast: "Contrast",
      saturation: "Saturation",
      gamma: "Gamma",
      whiteThreshold: "White threshold",
      alphaThreshold: "Alpha cutoff",
    },
    options: {
      renderAscii: "Classic ASCII",
      renderBlocks: "Half blocks",
      exportAnsi: "True Color ANSI",
      exportHtml: "HTML Export",
      plainText: "Plain text",
      charsetClassic: "Classic",
      charsetDense: "Dense",
      charsetShaded: "Shaded",
      charsetMinimal: "Minimal",
      custom: "Custom",
    },
    toggles: {
      invert: "Invert luminance mapping",
      trimBackground: "Auto clean background",
      defringe: "Defringe edges",
      fastfetchCompact: "Fastfetch compact export",
      useColor: "Keep colors",
      showBackground: "Show light background",
    },
    preview: {
      title: "Image to Text",
      copy: "Copy output",
      download: "Download text",
      waiting: "Upload an image to see generation stats here.",
      output: "Exported output",
    },
    import: {
      title: "Text to Image",
      useCurrent: "Use current output",
      render: "Render text",
      input: "Input content",
      uploadTitle: "Upload a TXT / ANSI / HTML file",
      uploadSubtitle: "Or paste exported content directly and render it back into an image preview",
    },
    stats: {
      source: "Source",
      sample: "Sample",
      characters: "Visible chars",
      visible: "Image bounds",
      export: "Export bounds",
    },
    alerts: {
      importReadFailed: "Failed to read the text file. Please try again.",
      copyFailed: "Failed to copy the output. Please try again.",
    },
  },
};

const state = {
  image: null,
  objectUrl: "",
  lastOutput: "",
  language: localStorage.getItem(STORAGE_KEYS.language) || document.documentElement.lang || "zh-CN",
};

const asciiPreviewCanvas = document.getElementById("asciiPreviewCanvas");
const asciiPreviewContext = asciiPreviewCanvas.getContext("2d");
const importPreviewCanvas = document.getElementById("importPreviewCanvas");
const importPreviewContext = importPreviewCanvas.getContext("2d");
const asciiStage = document.getElementById("asciiStage");
const importStage = document.getElementById("importStage");
const outputText = document.getElementById("outputText");
const importText = document.getElementById("importText");
const statsBar = document.getElementById("statsBar");
const sourceCanvas = document.getElementById("sourceCanvas");
const sourceContext = sourceCanvas.getContext("2d");
const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const importTextFile = document.getElementById("importTextFile");
const languageToggle = document.getElementById("languageToggle");

const controls = {
  renderMode: document.getElementById("renderMode"),
  exportMode: document.getElementById("exportMode"),
  charsetPreset: document.getElementById("charsetPreset"),
  customCharset: document.getElementById("customCharset"),
  widthRange: document.getElementById("widthRange"),
  aspectRange: document.getElementById("aspectRange"),
  brightnessRange: document.getElementById("brightnessRange"),
  contrastRange: document.getElementById("contrastRange"),
  saturationRange: document.getElementById("saturationRange"),
  gammaRange: document.getElementById("gammaRange"),
  whiteThresholdRange: document.getElementById("whiteThresholdRange"),
  alphaThresholdRange: document.getElementById("alphaThresholdRange"),
  invertToggle: document.getElementById("invertToggle"),
  trimBackgroundToggle: document.getElementById("trimBackgroundToggle"),
  defringeToggle: document.getElementById("defringeToggle"),
  fastfetchCompactToggle: document.getElementById("fastfetchCompactToggle"),
  useColorToggle: document.getElementById("useColorToggle"),
  showBackgroundToggle: document.getElementById("showBackgroundToggle"),
};

const numericInputs = {
  widthInput: document.getElementById("widthInput"),
  aspectInput: document.getElementById("aspectInput"),
  brightnessInput: document.getElementById("brightnessInput"),
  contrastInput: document.getElementById("contrastInput"),
  saturationInput: document.getElementById("saturationInput"),
  gammaInput: document.getElementById("gammaInput"),
  whiteThresholdInput: document.getElementById("whiteThresholdInput"),
  alphaThresholdInput: document.getElementById("alphaThresholdInput"),
};

const charsetMap = {
  classic: " .'`^\\\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  dense: " .'`^\\\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  shaded: " .:-=+*#%@",
  minimal: " .:oO@",
};

const hiddenCanvas = document.createElement("canvas");
const hiddenContext = hiddenCanvas.getContext("2d", { willReadFrequently: true });
const previewFontSize = 12;
const previewLineHeight = 14;
const previewFontFamily = '"Cascadia Mono", Consolas, "IBM Plex Mono", monospace';
let pendingRender = 0;
let renderTimer = 0;
const defaultControlState = new Map();

function t(path) {
  const language = translations[state.language] ? state.language : "zh-CN";
  return path.split(".").reduce((value, segment) => (value && value[segment] !== undefined ? value[segment] : null), translations[language]) ?? path;
}

function applyTranslations() {
  if (!translations[state.language]) {
    state.language = "zh-CN";
  }

  document.documentElement.lang = state.language;
  document.title = t("documentTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll(".reset-button").forEach((button) => {
    const label = t("common.reset");
    button.title = label;
    button.setAttribute("aria-label", label);
  });

  languageToggle.textContent = t("languageToggle");
  languageToggle.title = t("languageToggleLabel");
  languageToggle.setAttribute("aria-label", t("languageToggleLabel"));
}

function setLanguage(language) {
  state.language = language === "en" ? "en" : "zh-CN";
  localStorage.setItem(STORAGE_KEYS.language, state.language);
  applyTranslations();
  renderAscii();
  renderImportedTextContent(importText.value);
}

function syncLabels() {
  const focusedElement = document.activeElement;
  const syncIfNotFocused = (inputElement, nextValue) => {
    if (focusedElement !== inputElement) {
      inputElement.value = nextValue;
    }
  };

  syncIfNotFocused(numericInputs.widthInput, controls.widthRange.value);
  syncIfNotFocused(numericInputs.aspectInput, Number(controls.aspectRange.value).toFixed(2));
  syncIfNotFocused(numericInputs.brightnessInput, controls.brightnessRange.value);
  syncIfNotFocused(numericInputs.contrastInput, controls.contrastRange.value);
  syncIfNotFocused(numericInputs.saturationInput, controls.saturationRange.value);
  syncIfNotFocused(numericInputs.gammaInput, Number(controls.gammaRange.value).toFixed(2));
  syncIfNotFocused(numericInputs.whiteThresholdInput, controls.whiteThresholdRange.value);
  syncIfNotFocused(numericInputs.alphaThresholdInput, controls.alphaThresholdRange.value);
}

function getCharset() {
  if (controls.charsetPreset.value === "custom") {
    return dedupeCharset(controls.customCharset.value || charsetMap.shaded);
  }
  return charsetMap[controls.charsetPreset.value] || charsetMap.shaded;
}

function dedupeCharset(input) {
  const seen = new Set();
  return (
    [...input]
      .filter((char) => {
        if (seen.has(char)) {
          return false;
        }
        seen.add(char);
        return true;
      })
      .join("") || charsetMap.shaded
  );
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toLuminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function applyAdjustments(r, g, b) {
  const brightness = Number(controls.brightnessRange.value);
  const contrast = Number(controls.contrastRange.value);
  const saturation = Number(controls.saturationRange.value) / 100;
  const gamma = Number(controls.gammaRange.value);

  let nr = r + brightness;
  let ng = g + brightness;
  let nb = b + brightness;

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  nr = contrastFactor * (nr - 128) + 128;
  ng = contrastFactor * (ng - 128) + 128;
  nb = contrastFactor * (nb - 128) + 128;

  const gray = 0.2126 * nr + 0.7152 * ng + 0.0722 * nb;
  nr = gray + (nr - gray) * (1 + saturation);
  ng = gray + (ng - gray) * (1 + saturation);
  nb = gray + (nb - gray) * (1 + saturation);

  nr = 255 * Math.pow(clamp(nr, 0, 255) / 255, 1 / gamma);
  ng = 255 * Math.pow(clamp(ng, 0, 255) / 255, 1 / gamma);
  nb = 255 * Math.pow(clamp(nb, 0, 255) / 255, 1 / gamma);

  return [Math.round(clamp(nr, 0, 255)), Math.round(clamp(ng, 0, 255)), Math.round(clamp(nb, 0, 255))];
}

function detectBorderBackground(data, width, height, threshold, alphaCutoff) {
  const visited = new Uint8Array(width * height);
  const background = new Uint8Array(width * height);
  const queue = [];
  let head = 0;

  function isWhiteish(index) {
    const offset = index * 4;
    const alpha = data[offset + 3];
    if (alpha <= alphaCutoff) {
      return true;
    }
    return data[offset] >= threshold && data[offset + 1] >= threshold && data[offset + 2] >= threshold;
  }

  function push(index) {
    if (index < 0 || index >= width * height || visited[index] || !isWhiteish(index)) {
      return;
    }
    visited[index] = 1;
    queue.push(index);
  }

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }

  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < queue.length) {
    const index = queue[head];
    head += 1;
    background[index] = 1;
    const x = index % width;
    const y = (index - x) / width;
    if (x > 0) push(index - 1);
    if (x + 1 < width) push(index + 1);
    if (y > 0) push(index - width);
    if (y + 1 < height) push(index + width);
  }

  return background;
}

function createEdgeMask(backgroundMask, width, height) {
  const edgeMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (backgroundMask[index] === 1) {
        continue;
      }

      const left = x > 0 ? backgroundMask[index - 1] : 1;
      const right = x + 1 < width ? backgroundMask[index + 1] : 1;
      const top = y > 0 ? backgroundMask[index - width] : 1;
      const bottom = y + 1 < height ? backgroundMask[index + width] : 1;

      if (left || right || top || bottom) {
        edgeMask[index] = 1;
      }
    }
  }

  return edgeMask;
}

function chooseChar(luminance, charset, invert) {
  const ramp = invert ? [...charset].reverse().join("") : charset;
  const position = Math.round((luminance / 255) * (ramp.length - 1));
  return ramp[position] || ramp[ramp.length - 1] || " ";
}

function samplePixel(data, width, x, y) {
  const offset = (y * width + x) * 4;
  return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
}

function removeWhiteMatte(r, g, b) {
  const maxDiff = Math.max(255 - r, 255 - g, 255 - b);
  const alphaApprox = clamp(maxDiff / 192, 0.2, 1);
  const strength = 0.72;
  const recover = (channel) => clamp((channel - 255 * (1 - alphaApprox)) / alphaApprox, 0, 255);
  const rr = recover(r);
  const rg = recover(g);
  const rb = recover(b);
  return [
    Math.round(r + (rr - r) * strength),
    Math.round(g + (rg - g) * strength),
    Math.round(b + (rb - b) * strength),
  ];
}

function formatAnsiLine(parts) {
  let output = "";
  let hasActiveStyle = false;

  for (const part of parts) {
    if (part === " ") {
      output += hasActiveStyle ? "\u001b[0m " : " ";
      hasActiveStyle = false;
      continue;
    }

    output += part;
    hasActiveStyle = part.includes("\u001b[");
  }

  return hasActiveStyle ? `${output}\u001b[0m` : output;
}

function formatHtmlLine(parts) {
  return parts.join("");
}

function getPreviewTextColor() {
  return controls.showBackgroundToggle.checked ? "#23170d" : "#f7efe7";
}

function setupCanvas(targetCanvas, targetContext, columns, rows) {
  targetContext.font = `${previewFontSize}px ${previewFontFamily}`;
  targetContext.textBaseline = "top";

  const metrics = targetContext.measureText("M");
  const cellWidth = Math.ceil(metrics.width);
  const cellHeight = previewLineHeight;
  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = Math.max(1, columns * cellWidth);
  const canvasHeight = Math.max(1, rows * cellHeight);

  targetCanvas.width = Math.max(1, Math.round(canvasWidth * dpr));
  targetCanvas.height = Math.max(1, Math.round(canvasHeight * dpr));
  targetCanvas.style.width = `${canvasWidth}px`;
  targetCanvas.style.height = `${canvasHeight}px`;

  targetContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  targetContext.clearRect(0, 0, canvasWidth, canvasHeight);
  targetContext.font = `${previewFontSize}px ${previewFontFamily}`;
  targetContext.textBaseline = "top";

  return { cellWidth, cellHeight };
}

function renderCell(targetContext, char, x, y, cellWidth, cellHeight, foreground, background) {
  if (background) {
    targetContext.fillStyle = background;
    targetContext.fillRect(x, y, cellWidth, cellHeight);
  }

  if (char === " ") {
    return;
  }

  targetContext.fillStyle = foreground;
  targetContext.fillText(char, x, y);
}

function scheduleRender(delay = 0) {
  if (renderTimer) {
    window.clearTimeout(renderTimer);
  }

  renderTimer = window.setTimeout(() => {
    if (pendingRender) {
      window.cancelAnimationFrame(pendingRender);
    }
    pendingRender = window.requestAnimationFrame(() => {
      pendingRender = 0;
      renderAscii();
    });
  }, delay);
}

function captureDefaultState(element) {
  if (!element || !element.id || defaultControlState.has(element.id)) {
    return;
  }

  defaultControlState.set(
    element.id,
    element.type === "checkbox"
      ? { type: "checkbox", checked: element.defaultChecked }
      : { type: "value", value: element.tagName === "SELECT" ? element.value : element.defaultValue }
  );
}

function resetTargetsToDefault(targetIds) {
  targetIds.forEach((targetId) => {
    const element = document.getElementById(targetId);
    const snapshot = defaultControlState.get(targetId);
    if (!element || !snapshot) {
      return;
    }

    if (snapshot.type === "checkbox") {
      element.checked = snapshot.checked;
    } else {
      element.value = snapshot.value;
    }
  });

  syncLabels();
  scheduleRender();
}

function resetImportPreview() {
  importPreviewContext.clearRect(0, 0, importPreviewCanvas.width, importPreviewCanvas.height);
  importStage.classList.toggle("light-bg", false);
}

function parseAnsiCodes(sequence, colorState) {
  if (!sequence) {
    colorState.fg = null;
    colorState.bg = null;
    return;
  }

  const values = sequence.split(";").map((part) => Number(part || 0));
  for (let index = 0; index < values.length; index += 1) {
    const code = values[index];
    if (code === 0) {
      colorState.fg = null;
      colorState.bg = null;
    } else if (code === 39) {
      colorState.fg = null;
    } else if (code === 49) {
      colorState.bg = null;
    } else if (code === 38 && values[index + 1] === 2) {
      colorState.fg = `rgb(${values[index + 2]}, ${values[index + 3]}, ${values[index + 4]})`;
      index += 4;
    } else if (code === 48 && values[index + 1] === 2) {
      colorState.bg = `rgb(${values[index + 2]}, ${values[index + 3]}, ${values[index + 4]})`;
      index += 4;
    }
  }
}

function pushTextCells(lines, text, fg, bg) {
  for (const char of text) {
    if (char === "\r") {
      continue;
    }
    if (char === "\n") {
      lines.push([]);
      continue;
    }
    lines[lines.length - 1].push({ char, fg: fg || "#f7efe7", bg: bg || "" });
  }
}

function parseAnsiText(content) {
  const lines = [[]];
  const colorState = { fg: null, bg: null };
  const regex = /\u001b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let match = regex.exec(content);

  while (match) {
    pushTextCells(lines, content.slice(lastIndex, match.index), colorState.fg, colorState.bg);
    parseAnsiCodes(match[1], colorState);
    lastIndex = regex.lastIndex;
    match = regex.exec(content);
  }

  pushTextCells(lines, content.slice(lastIndex), colorState.fg, colorState.bg);
  return lines;
}

function parseHtmlText(content) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(content, "text/html");
  const root = parsedDocument.querySelector("pre") || parsedDocument.body;
  const lines = [[]];

  const walk = (node, inheritedStyle = { fg: "", bg: "" }) => {
    if (node.nodeType === Node.TEXT_NODE) {
      pushTextCells(lines, node.textContent || "", inheritedStyle.fg || "#f7efe7", inheritedStyle.bg || "");
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const element = node;
    if (element.tagName === "BR") {
      lines.push([]);
      return;
    }

    const nextStyle = {
      fg: element.style.color?.trim() || inheritedStyle.fg || "",
      bg: element.style.backgroundColor?.trim() || inheritedStyle.bg || "",
    };
    element.childNodes.forEach((childNode) => walk(childNode, nextStyle));
  };

  root.childNodes.forEach((childNode) => walk(childNode, { fg: "", bg: "" }));
  return lines;
}

function parsePlainText(content) {
  return content.split(/\r?\n/).map((line) => [...line].map((char) => ({ char, fg: "#f7efe7", bg: "" })));
}

function detectImportedTextFormat(content) {
  if (content.includes("\u001b[")) {
    return "ansi";
  }
  if (/<pre[\s>]|<span[\s>]|<\/span>|<\/pre>/i.test(content)) {
    return "html";
  }
  return "plain";
}

function renderImportedTextToCanvas(lines) {
  const rowCount = Math.max(1, lines.length);
  const columnCount = Math.max(1, ...lines.map((line) => line.length));
  const { cellWidth, cellHeight } = setupCanvas(importPreviewCanvas, importPreviewContext, columnCount, rowCount);
  let usesLightBackground = false;

  lines.forEach((line, rowIndex) => {
    line.forEach((cell, columnIndex) => {
      if (cell.bg && /255,\s*255,\s*255|white/i.test(cell.bg)) {
        usesLightBackground = true;
      }
      renderCell(
        importPreviewContext,
        cell.char,
        columnIndex * cellWidth,
        rowIndex * cellHeight,
        cellWidth,
        cellHeight,
        cell.fg || "#f7efe7",
        cell.bg || ""
      );
    });
  });

  importStage.classList.toggle("light-bg", usesLightBackground);
}

function renderImportedTextContent(content) {
  if (!content.trim()) {
    resetImportPreview();
    return;
  }

  const format = detectImportedTextFormat(content);
  const lines =
    format === "ansi" ? parseAnsiText(content) : format === "html" ? parseHtmlText(content) : parsePlainText(content);
  renderImportedTextToCanvas(lines);
}

function setWaitingStats() {
  statsBar.innerHTML = `<span>${t("preview.waiting")}</span>`;
}

function renderAscii() {
  syncLabels();

  if (!state.image) {
    asciiPreviewContext.clearRect(0, 0, asciiPreviewCanvas.width, asciiPreviewCanvas.height);
    outputText.value = "";
    state.lastOutput = "";
    asciiStage.classList.toggle("light-bg", controls.showBackgroundToggle.checked);
    setWaitingStats();
    return;
  }

  const widthChars = Number(controls.widthRange.value);
  const renderMode = controls.renderMode.value;
  const aspect = Number(controls.aspectRange.value);
  const sourceWidth = state.image.naturalWidth || state.image.width;
  const sourceHeight = state.image.naturalHeight || state.image.height;
  const sampleHeight =
    renderMode === "blocks"
      ? Math.max(2, Math.round((sourceHeight / sourceWidth) * widthChars * aspect * 2))
      : Math.max(1, Math.round((sourceHeight / sourceWidth) * widthChars * aspect));

  hiddenCanvas.width = widthChars;
  hiddenCanvas.height = sampleHeight;
  hiddenContext.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
  hiddenContext.drawImage(state.image, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

  const imageData = hiddenContext.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
  const data = imageData.data;
  const whiteThreshold = Number(controls.whiteThresholdRange.value);
  const alphaThreshold = Number(controls.alphaThresholdRange.value);
  const trimBackground = controls.trimBackgroundToggle.checked;
  const defringe = controls.defringeToggle.checked;
  const backgroundMask =
    trimBackground || defringe
      ? detectBorderBackground(data, hiddenCanvas.width, hiddenCanvas.height, whiteThreshold, alphaThreshold)
      : new Uint8Array(hiddenCanvas.width * hiddenCanvas.height);
  const edgeMask = defringe ? createEdgeMask(backgroundMask, hiddenCanvas.width, hiddenCanvas.height) : null;
  const invert = controls.invertToggle.checked;
  const useColor = controls.useColorToggle.checked;
  const charset = getCharset();
  const exportMode = controls.exportMode.value;
  const compactExport = controls.fastfetchCompactToggle.checked;
  const outputRows = [];
  const previewRows = renderMode === "blocks" ? Math.ceil(hiddenCanvas.height / 2) : hiddenCanvas.height;
  const { cellWidth, cellHeight } = setupCanvas(asciiPreviewCanvas, asciiPreviewContext, hiddenCanvas.width, previewRows);
  const fallbackPreviewColor = getPreviewTextColor();

  let filledCells = 0;
  let minVisibleX = hiddenCanvas.width;
  let minVisibleY = previewRows;
  let maxVisibleX = -1;
  let maxVisibleY = -1;

  const trackBounds = (x, y) => {
    filledCells += 1;
    minVisibleX = Math.min(minVisibleX, x);
    minVisibleY = Math.min(minVisibleY, y);
    maxVisibleX = Math.max(maxVisibleX, x);
    maxVisibleY = Math.max(maxVisibleY, y);
  };

  if (renderMode === "blocks") {
    for (let y = 0; y < hiddenCanvas.height; y += 2) {
      const previewRow = Math.floor(y / 2);
      const outputParts = [];

      for (let x = 0; x < hiddenCanvas.width; x += 1) {
        const topIndex = y * hiddenCanvas.width + x;
        const bottomY = Math.min(hiddenCanvas.height - 1, y + 1);
        const bottomIndex = bottomY * hiddenCanvas.width + x;
        const topMasked = backgroundMask[topIndex] === 1;
        const bottomMasked = backgroundMask[bottomIndex] === 1;

        let char = " ";
        let token = " ";
        let fg = fallbackPreviewColor;
        let bg = "";

        if (!(topMasked && bottomMasked)) {
          const [topR, topG, topB, topA] = samplePixel(data, hiddenCanvas.width, x, y);
          const [bottomR, bottomG, bottomB, bottomA] = samplePixel(data, hiddenCanvas.width, x, bottomY);
          const topPixel = edgeMask?.[topIndex] ? removeWhiteMatte(topR, topG, topB) : [topR, topG, topB];
          const bottomPixel = edgeMask?.[bottomIndex] ? removeWhiteMatte(bottomR, bottomG, bottomB) : [bottomR, bottomG, bottomB];
          const [tr, tg, tb] = applyAdjustments(topPixel[0], topPixel[1], topPixel[2]);
          const [br, bgc, bb] = applyAdjustments(bottomPixel[0], bottomPixel[1], bottomPixel[2]);
          const topVisible = topA > alphaThreshold && !topMasked;
          const bottomVisible = bottomA > alphaThreshold && !bottomMasked;

          if (topVisible && bottomVisible) {
            if (useColor) {
              char = "▀";
              fg = `rgb(${tr}, ${tg}, ${tb})`;
              bg = `rgb(${br}, ${bgc}, ${bb})`;
              token =
                exportMode === "ansi"
                  ? `\u001b[38;2;${tr};${tg};${tb}m\u001b[48;2;${br};${bgc};${bb}m${char}`
                  : exportMode === "html"
                    ? `<span style="color: rgb(${tr}, ${tg}, ${tb}); background: rgb(${br}, ${bgc}, ${bb})">${char}</span>`
                    : char;
            } else {
              char = chooseChar((toLuminance(tr, tg, tb) + toLuminance(br, bgc, bb)) / 2, charset, invert);
              token = exportMode === "html" ? escapeHtml(char) : char;
            }
          } else if (topVisible) {
            char = useColor ? "▀" : chooseChar(toLuminance(tr, tg, tb), charset, invert);
            fg = useColor ? `rgb(${tr}, ${tg}, ${tb})` : fallbackPreviewColor;
            token =
              exportMode === "ansi" && useColor
                ? `\u001b[38;2;${tr};${tg};${tb}m${char}`
                : exportMode === "html" && useColor
                  ? `<span style="color: rgb(${tr}, ${tg}, ${tb})">${char}</span>`
                  : exportMode === "html"
                    ? escapeHtml(char)
                    : char;
          } else if (bottomVisible) {
            char = useColor ? "▄" : chooseChar(toLuminance(br, bgc, bb), charset, invert);
            fg = useColor ? `rgb(${br}, ${bgc}, ${bb})` : fallbackPreviewColor;
            token =
              exportMode === "ansi" && useColor
                ? `\u001b[38;2;${br};${bgc};${bb}m${char}`
                : exportMode === "html" && useColor
                  ? `<span style="color: rgb(${br}, ${bgc}, ${bb})">${char}</span>`
                  : exportMode === "html"
                    ? escapeHtml(char)
                    : char;
          }
        }

        if (char !== " ") {
          trackBounds(x, previewRow);
        }

        renderCell(asciiPreviewContext, char, x * cellWidth, previewRow * cellHeight, cellWidth, cellHeight, fg, bg);
        outputParts.push(token);
      }

      outputRows.push(outputParts);
    }
  } else {
    for (let y = 0; y < hiddenCanvas.height; y += 1) {
      const outputParts = [];

      for (let x = 0; x < hiddenCanvas.width; x += 1) {
        const index = y * hiddenCanvas.width + x;
        const [r, g, b, a] = samplePixel(data, hiddenCanvas.width, x, y);
        if (a <= alphaThreshold || backgroundMask[index] === 1) {
          outputParts.push(" ");
          continue;
        }

        const edgeCleaned = edgeMask?.[index] ? removeWhiteMatte(r, g, b) : [r, g, b];
        const [nr, ng, nb] = applyAdjustments(edgeCleaned[0], edgeCleaned[1], edgeCleaned[2]);
        const char = chooseChar(toLuminance(nr, ng, nb), charset, invert);

        renderCell(
          asciiPreviewContext,
          char,
          x * cellWidth,
          y * cellHeight,
          cellWidth,
          cellHeight,
          useColor ? `rgb(${nr}, ${ng}, ${nb})` : fallbackPreviewColor,
          ""
        );

        outputParts.push(
          exportMode === "ansi"
            ? useColor
              ? `\u001b[38;2;${nr};${ng};${nb}m${char}`
              : char
            : exportMode === "html"
              ? useColor
                ? `<span style="color: rgb(${nr}, ${ng}, ${nb})">${escapeHtml(char)}</span>`
                : escapeHtml(char)
              : char
        );

        trackBounds(x, y);
      }

      outputRows.push(outputParts);
    }
  }

  const hasVisibleContent = maxVisibleX >= 0 && maxVisibleY >= 0;
  const effectiveMinX = compactExport && hasVisibleContent ? minVisibleX : 0;
  const effectiveMaxX = compactExport && hasVisibleContent ? maxVisibleX : hiddenCanvas.width - 1;
  const effectiveMinY = compactExport && hasVisibleContent ? minVisibleY : 0;
  const effectiveMaxY = compactExport && hasVisibleContent ? maxVisibleY : outputRows.length - 1;
  const visibleWidth = hasVisibleContent ? maxVisibleX - minVisibleX + 1 : 0;
  const visibleHeight = hasVisibleContent ? maxVisibleY - minVisibleY + 1 : 0;

  const outputLines = outputRows
    .slice(effectiveMinY, effectiveMaxY + 1)
    .map((row) => row.slice(effectiveMinX, effectiveMaxX + 1))
    .map((parts) => (exportMode === "ansi" ? formatAnsiLine(parts) : exportMode === "html" ? formatHtmlLine(parts) : parts.join("")));

  let output = outputLines.join("\n");
  if (exportMode === "html") {
    output = `<pre style="font-family: 'IBM Plex Mono', monospace; line-height: 0.92; background: transparent; white-space: pre;">${output}</pre>`;
  }

  outputText.value = output;
  state.lastOutput = output;
  statsBar.innerHTML = `
    <span>${t("stats.source")} ${sourceWidth} x ${sourceHeight}</span>
    <span>${t("stats.sample")} ${hiddenCanvas.width} x ${hiddenCanvas.height}</span>
    <span>${t("stats.characters")} ${filledCells}</span>
    <span>${t("stats.visible")} ${visibleWidth} x ${visibleHeight}</span>
    <span>${t("stats.export")} ${effectiveMaxX >= effectiveMinX ? effectiveMaxX - effectiveMinX + 1 : 0} x ${effectiveMaxY >= effectiveMinY ? effectiveMaxY - effectiveMinY + 1 : 0}</span>
  `;
  asciiStage.classList.toggle("light-bg", controls.showBackgroundToggle.checked);
}

function drawSourcePreview() {
  if (!state.image) {
    sourceContext.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
    return;
  }

  const maxWidth = 720;
  const maxHeight = 360;
  const ratio = Math.min(maxWidth / state.image.width, maxHeight / state.image.height, 1);
  sourceCanvas.width = Math.round(state.image.width * ratio);
  sourceCanvas.height = Math.round(state.image.height * ratio);
  sourceContext.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
  sourceContext.drawImage(state.image, 0, 0, sourceCanvas.width, sourceCanvas.height);
}

function handleImportFile(file) {
  if (!file) {
    return;
  }

  file
    .text()
    .then((content) => {
      importText.value = content;
      renderImportedTextContent(content);
    })
    .catch(() => {
      window.alert(t("alerts.importReadFailed"));
    });
}

function loadImage(file) {
  if (!file) {
    return;
  }

  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
  }

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    state.image = img;
    state.objectUrl = url;
    drawSourcePreview();
    scheduleRender();
  };
  img.src = url;
}

function handleDrop(event) {
  event.preventDefault();
  dropZone.classList.remove("dragover");
  const [file] = event.dataTransfer.files;
  loadImage(file);
}

function downloadOutput() {
  if (!state.lastOutput) {
    return;
  }

  const extension = controls.exportMode.value === "html" ? "html" : "txt";
  const blob = new Blob([state.lastOutput], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${t("common.fileName")}.${extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function copyOutput() {
  if (!state.lastOutput) {
    return;
  }
  await navigator.clipboard.writeText(state.lastOutput);
}

function bindRangeAndInput(rangeElement, inputElement, options = {}) {
  const min = Number(rangeElement.min);
  const max = Number(rangeElement.max);
  const step = Number(rangeElement.step || 1);
  const decimals = step < 1 ? String(step).split(".")[1]?.length || 0 : 0;
  const commitOnInput = options.commitOnInput ?? true;

  const normalize = (rawValue, fallbackValue) => {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
      return fallbackValue;
    }
    const clamped = clamp(parsed, min, max);
    return decimals > 0 ? clamped.toFixed(decimals) : String(Math.round(clamped));
  };

  rangeElement.addEventListener("input", () => {
    inputElement.value = normalize(rangeElement.value, rangeElement.value);
    scheduleRender();
  });

  inputElement.addEventListener("input", () => {
    const rawValue = inputElement.value.trim();
    if (!rawValue || rawValue === "-" || !commitOnInput) {
      return;
    }

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
      return;
    }

    rangeElement.value = String(clamp(parsed, min, max));
    scheduleRender(90);
  });

  const commit = () => {
    const nextValue = normalize(inputElement.value, rangeElement.value);
    rangeElement.value = nextValue;
    inputElement.value = nextValue;
    scheduleRender();
  };

  inputElement.addEventListener("change", commit);
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      commit();
    }
  });
}

imageInput.addEventListener("change", (event) => loadImage(event.target.files[0]));

dropZone.addEventListener("dragenter", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", handleDrop);

languageToggle.addEventListener("click", () => {
  setLanguage(state.language === "zh-CN" ? "en" : "zh-CN");
});

document.getElementById("copyOutput").addEventListener("click", () => {
  copyOutput().catch(() => {
    window.alert(t("alerts.copyFailed"));
  });
});
document.getElementById("downloadOutput").addEventListener("click", downloadOutput);
document.getElementById("useCurrentOutput").addEventListener("click", () => {
  importText.value = outputText.value;
  renderImportedTextContent(outputText.value);
});
document.getElementById("renderImportedText").addEventListener("click", () => {
  renderImportedTextContent(importText.value);
});
importTextFile.addEventListener("change", (event) => handleImportFile(event.target.files[0]));

document.querySelectorAll("input, select, textarea").forEach(captureDefaultState);

document.addEventListener("click", (event) => {
  const button = event.target.closest(".reset-button");
  if (!button) {
    return;
  }

  const targetIds = (button.dataset.resetTarget || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (targetIds.length) {
    resetTargetsToDefault(targetIds);
  }
});

[
  [controls.widthRange, numericInputs.widthInput, { commitOnInput: false }],
  [controls.aspectRange, numericInputs.aspectInput, { commitOnInput: false }],
  [controls.brightnessRange, numericInputs.brightnessInput, {}],
  [controls.contrastRange, numericInputs.contrastInput, {}],
  [controls.saturationRange, numericInputs.saturationInput, {}],
  [controls.gammaRange, numericInputs.gammaInput, {}],
  [controls.whiteThresholdRange, numericInputs.whiteThresholdInput, {}],
  [controls.alphaThresholdRange, numericInputs.alphaThresholdInput, {}],
].forEach(([rangeElement, inputElement, options]) => bindRangeAndInput(rangeElement, inputElement, options));

[
  controls.renderMode,
  controls.exportMode,
  controls.charsetPreset,
  controls.customCharset,
  controls.invertToggle,
  controls.trimBackgroundToggle,
  controls.defringeToggle,
  controls.fastfetchCompactToggle,
  controls.useColorToggle,
  controls.showBackgroundToggle,
].forEach((control) => {
  control.addEventListener("input", () => scheduleRender(control === controls.customCharset ? 90 : 0));
  control.addEventListener("change", () => scheduleRender());
});

applyTranslations();
syncLabels();
drawSourcePreview();
setWaitingStats();
resetImportPreview();

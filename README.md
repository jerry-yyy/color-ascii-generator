# color-ascii-generator

A lightweight browser tool for converting images into colored ASCII and rendering exported text back into an image preview.  
一个轻量的浏览器工具，用来把图片转换成彩色 ASCII，也可以把导出的文本重新渲染成图像预览。

## Overview | 概览

A fully static web project with no backend and no build step.  
一个纯静态网页项目，不需要后端，也不需要构建步骤。

Supports two directions: **Image to Text** and **Text to Image**.  
支持两个方向：**Image to Text** 和 **Text to Image**。

## Features | 功能

- Real-time colored ASCII generation, entirely in-browser  
  浏览器内实时生成彩色 ASCII
- Reverse preview from exported text files  
  支持从导出文本文件反向预览为图像
- Classic ASCII mode and half-block mode  
  支持经典 ASCII 模式和半块字符模式
- True Color ANSI, HTML, and plain text export  
  支持 True Color ANSI、HTML 和纯文本导出
- Background cleanup and defringe controls  
  支持背景清理和去白边控制

## Usage | 使用方式

Open `index.html` in any modern browser — that's it.
用浏览器打开 `index.html` 即可使用。

## Key Settings | 关键参数

### Width | 宽度

Controls output width in characters.  
控制输出结果的横向字符数量。

### Aspect Correction | 纵横修正

Compensates for character cell proportions.  
用于补偿字符单元本身的宽高比例。

### Render Mode | 输出模式

- `Classic ASCII`: traditional character ramp output  
  `Classic ASCII`：传统字符渐变输出
- `Half blocks`: denser output with upper and lower half-block characters  
  `Half blocks`：使用上下半块字符，细节更高

### Background Cleanup | 背景清理

- `Auto clean background`: removes border-connected bright background areas  
  `Auto clean background`：清理与边缘连通的亮色背景
- `Defringe edges`: reduces white or gray edge halos  
  `Defringe edges`：减少边缘白边和灰边

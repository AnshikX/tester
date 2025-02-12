export const  STYLECATEGORIES = [
    {
      category: "Dimensions",
      properties: [
        { name: "width", type: "dimension" },
        { name: "height", type: "dimension" },
        { name: "padding", type: "dimension" },
        { name: "margin", type: "dimension" },
      ],
    },
    {
      category: "Alignment",
      properties: [
        {
          name: "display",
          type: "select",
          options: ["block", "flex", "inline", "none"],
        },
        {
          name: "flexDirection",
          type: "select",
          options: ["row", "column", "row-reverse", "column-reverse"],
        },
        {
          name: "justifyContent",
          type: "select",
          options: [
            "flex-start",
            "flex-end",
            "center",
            "space-between",
            "space-around",
          ],
        },
        {
          name: "alignItems",
          type: "select",
          options: ["stretch", "flex-start", "flex-end", "center", "baseline"],
        },
      ],
    },
    {
      category: "Colors",
      properties: [
        { name: "backgroundColor", type: "color" },
        { name: "color", type: "color" },
      ],
    },
    {
      category: "Border",
      properties: [
        {
          name: "borderWidth",
          type: "dimension",
          description: "Width of the border",
        },
        {
          name: "borderStyle",
          type: "select",
          options: ["solid", "dotted", "dashed", "double", "none"],
          description: "Style of the border",
        },
        {
          name: "borderColor",
          type: "color",
          description: "Color of the border",
        },
        { name: "borderRadius", type: "dimension" },
      ],
    },
    {
      category: "Typography",
      properties: [
        {
          name: "fontFamily",
          type: "select",
          options: ["Arial", "Roboto", "Times New Roman", "Verdana"],
          description: "Font family of the text",
        },
        {
          name: "fontSize",
          type: "dimension",
          description: "Size of the font",
        },
        {
          name: "fontWeight",
          type: "select",
          options: ["normal", "bold", "lighter", "bolder"],
          description: "Weight of the font",
        },
        {
          name: "fontStyle",
          type: "select",
          options: ["normal", "italic", "oblique"],
          description: "Style of the font",
        },
        {
          name: "lineHeight",
          type: "dimension",
          description: "Spacing between lines",
        },
        {
          name: "letterSpacing",
          type: "dimension",
          description: "Spacing between letters",
        },
        {
          name: "textAlign",
          type: "select",
          options: ["left", "center", "right", "justify"],
          description: "Horizontal alignment of text",
        },
        {
          name: "textDecoration",
          type: "select",
          options: ["none", "underline", "overline", "line-through"],
          description: "Text decoration",
        },
        {
          name: "textTransform",
          type: "select",
          options: ["none", "uppercase", "lowercase", "capitalize"],
          description: "Transform the text case",
        },
      ],
    },
  ];

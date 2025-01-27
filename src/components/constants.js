export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";

export const SIDEBAR_ITEMS = [
  {
    elementType: "HTML",
    id: "button",
    tagName: "button",
    label: "Button",
    attributes: {
      onClick: {
        type: "CUSTOM",
        value: '()=>console.log("hi")',
      },
    },
    children: [],
  },
  {
    elementType: "TEXT",
    label: "Text",
    id: "text",
    value: "Hello World",
  },
  {
    elementType: "HTML",
    id: "input",
    tagName: "input",
    label: "Input",
    attributes: {},
    children: [],
  },
  {
    elementType: "HTML",
    id: "div",
    tagName: "div",
    label: "Container",
    attributes: {},
    children: [],
  },
  {
    elementType: "HTML",
    id: "span",
    tagName: "span",
    label: "Span",
    attributes: {},
    children: [],
  },
];

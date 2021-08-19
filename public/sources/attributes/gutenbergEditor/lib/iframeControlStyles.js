export const iframeControlStyles = () => {
  return `<style>
    .vcv-gutenberg-controls-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: auto;
    }
    .vcv-gutenberg-modal-update-button {
      height: 100%;
      min-height: 39px;
      padding: 8px 32px;
      border-radius: 3px;
      border: none;
      background: #304568;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }
    .vcv-gutenberg-modal-update-button:hover {
      background: #203251;
    }
    .vcv-gutenberg-modal-close-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0 10px;
      background: transparent;
      border: 0;
      box-shadow: none;
      padding: 5px;
      cursor: pointer;
      outline: none;
    }
    .vcv-gutenberg-modal-close-button:hover .vcv-ui-icon-close-thin {
      opacity: .9;
    }
    .vcv-ui-icon-close-thin {
      color: #7f7f7f;
      font-style: normal;
      font-size: 20px;
      opacity: .7;
    }
    .vcv-ui-icon-close-thin:before {
      content: "\\2717";
    }
  </style>`
}

import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "image-button-response",
  version: "1.0.0",
  parameters: {
    stimulus: {
      type: ParameterType.HTML_STRING,
      default: ""
    },
    choices: {
      type: ParameterType.STRING,
      default: [],
      array: true
    },
    button_html: {
      type: ParameterType.HTML_STRING,
      default: [] as string[],
      array: true
    },
    prompt: {
      type: ParameterType.HTML_STRING,
      default: null
    },
    margin_vertical: {
      type: ParameterType.INT,
      default: 10
    },
    margin_horizontal: {
      type: ParameterType.INT,
      default: 8
    }
  },
  data: {
    response: { type: ParameterType.OBJECT },
    rt: { type: ParameterType.INT }
  }
};

type Info = typeof info;

class ImageButtonResponsePlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const start_time = performance.now();

    const button_html = trial.button_html && trial.button_html.length > 0
      ? trial.button_html
      : trial.choices.map(() => '<button class="jspsych-btn">%choice%</button>');

    let html = `
      <div class="jspsych-image-button-response-stimulus" style="margin-bottom: 20px;">
        ${trial.stimulus}
      </div>
    `;

    if (trial.prompt) {
      html += `<div class="jspsych-image-button-response-prompt">${trial.prompt}</div>`;
    }

    html += `<div class="jspsych-image-button-response-button-container" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 12px;">`;

    for (let i = 0; i < trial.choices.length; i++) {
      const choice = trial.choices[i];
      const htmlString = button_html[i] || '<button class="jspsych-btn">%choice%</button>';
      const buttonMarkup = htmlString.replace('%choice%', choice);
      html += `<div class="jspsych-image-button-response-button" style="margin: ${trial.margin_vertical}px ${trial.margin_horizontal}px;">${buttonMarkup}</div>`;
    }

    html += `</div>`;
    display_element.innerHTML = html;

    const buttons = display_element.querySelectorAll('button');
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const button_index = Array.from(buttons).indexOf(button);
        const end_time = performance.now();
        const response = {
          button_index: button_index,
          button_label: trial.choices[button_index]
        };

        this.jsPsych.finishTrial({
          response,
          rt: Math.round(end_time - start_time)
        });
      });
    });
  }
}

export default ImageButtonResponsePlugin;

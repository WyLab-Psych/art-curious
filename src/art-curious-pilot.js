// Import FontAwesome icons
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faXmark, faEnvelope, faPhone, faMousePointer, faArrowUpRightFromSquare, faCircleCheck, faCircleXmark, faChevronCircleRight, faChevronCircleDown, faArrowTurnUp, faArrowRight, faCircleArrowRight, faTriangleExclamation, faArrowRightToBracket, faStopwatch, faRotateRight} from '@fortawesome/free-solid-svg-icons';
library.add(faXmark, faEnvelope, faPhone, faMousePointer, faArrowUpRightFromSquare, faCircleCheck, faCircleXmark, faChevronCircleRight, faChevronCircleDown, faArrowTurnUp, faArrowRight, faCircleArrowRight, faTriangleExclamation, faArrowRightToBracket, faStopwatch, faRotateRight);
dom.watch();

// Import jsPsych core and CSS
import stimuli from './stimuli/norming-targets.json' with { type: 'json' }
import { initJsPsych } from 'jspsych';
import 'jspsych/css/jspsych.css';
import './custom.css';

const stimulus_image_urls = import.meta.glob('./stimuli/images/*', {
  eager: true,
  query: '?url',
  import: 'default'
});

const task_stimuli = stimuli.map((stimulus) => ({
  ...stimulus,
  painting_image: stimulus_image_urls[stimulus.painting_image],
  photograph_image: stimulus_image_urls[stimulus.photograph_image]
}));

// Import core jsPsych plugins
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychWyLabSurvey from './plugins/plugin-wylab-survey';
import jsPsychImageButtonResponse from './plugins/plugin-image-button-response';

// Import officially contributed jsPsych plugins
import jsPsychPipe from '@jspsych-contrib/plugin-pipe';


dom.watch();

// ---------------- PAGE 0 ---------------- //
// STUDY INITIALIZATION
// Define global variables
let timeline = [];

// jsPsych Initialization
var jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  auto_preload: true,
  show_progress_bar: true,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }  
});

// Set up filename for debugging.
// const participant_id = jsPsych.randomization.randomID(10);
// const filename = `${participant_id}.csv`;
const prolific_completion_code = "C18V04DD";  // TODO: Replace with your actual Prolific completion code

// Set up filename for actual run
const get_url_value = (name) => {
  const value = jsPsych.data.getURLVariable(name);
  return value && value !== 'undefined' && value !== 'null' ? value : null;
};
const participant_id = get_url_value('PROLIFIC_PID');
const study_id = get_url_value('STUDY_ID');
const session_id = get_url_value('SESSION_ID');
const run_id = jsPsych.randomization.randomID(10);
const subject_id = participant_id || `fallback_${run_id}`;
const filename = `${subject_id}_${study_id || 'no-study'}_${session_id || 'no-session'}_${run_id}.csv`;
 
jsPsych.data.addProperties({
participant_id: participant_id,
study_id: study_id,
session_id: session_id});

// ---------------- PAGE 1 ---------------- //
// ENTER FULLSCREEN
const block_enter_fullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};
timeline.push(block_enter_fullscreen)

// ---------------- PAGE 2 ---------------- //
// CONSENT FORM
const completion_time = 8;  // TODO: Replace with your actual study completion time (in minutes)

const block_consent_form = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <section> 
      <h2 style="text-align: center"><strong>Consent Form</strong></h2>

      <p class="indented align-left">
        We are asking you to participate in a research study titled "Social Judgment and Decision-Making."
        We will describe this study to you and answer any of your questions. This form has information to help 
        you decide whether or not you wish to participate—please review it carefully. Your participation is voluntary. 
        This study is being led by Professor Jordan Wylie, Department of Psychology.
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What this study is about</strong></h3>
      <p class="indented align-left">
        The purpose of this research is to explore how people view and judge the actions of others. 
        You will not be made aware of the full nature or purpose of the research to maintain validity of the research, 
        but you will be fully debriefed at the end.
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What we will ask you to do</strong></h3>
      <p class="indented align-left">
        We will ask you to complete a study that takes approximately<i class="fa-solid fa-stopwatch"></i><strong>${completion_time} minutes</strong>. The study will include 
        demographic questions (e.g., age, gender), brief tasks or vignettes, and questions about your thoughts, 
        perceptions, and reactions. In some cases, you may be asked to read short stories or view images before answering questions.
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Risks and discomforts</strong></h3>
      <p class="indented align-left">
        Participants will be asked questions and encounter stimuli involving moral beliefs, which may be uncomfortable. 
        The images presented will include images from a standardized set, including gross and disgusting things 
        like rotten food and vomit as well as scary things like snakes and spiders. While there are measures put 
        in place by the researcher to secure data, there is always a risk of a potential breach of confidentiality. 
        Please tell the researchers if you believe you are harmed from your participation in the study. 
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Benefits</strong></h3>
      <p class="indented align-left">
        It is hoped that this study will contribute to knowledge about how people view and make judgements about others. 
        You are not expected to directly benefit from participation in the study.
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Incentives for participation</strong></h3>
      <p class="indented align-left">
        If participating through Prolific/Cloud, you will be paid <strong>$${(9 / 60 * completion_time).toFixed(2)} ($9.00/hour)</strong> for your participation in the study.
      </p>
    </section>
    
    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Privacy, confidentiality, and data security</strong></h3>
      <p class="indented align-left">
        You will not be asked to provide information that could be used to identify you personally. 
        Please note that the survey(s) are being conducted with the help of JsPsych, an organization not affiliated with Cornell and with its own privacy and security policies that you can find at its website. We anticipate that your participation in this survey presents no greater risk than everyday use of the Internet.<br>
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Sharing de-identified data collected in this research</strong></h3>
      <p class="indented align-left">
        De-identified data from this study may be shared with the research community 
        at large to advance science and health. We will remove or code any personal 
        information that could identify you before files are shared with other researchers 
        to ensure that, by current scientific standards and known methods, no one will be 
        able to identify you from the information we share. Despite these measures, 
        we cannot guarantee anonymity of your personal data.
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>Taking part is voluntary</strong></h3>
      <p class="indented align-left">
        Please remember that your participation is voluntary. You may refuse to participate 
        before the study begins, discontinue at any time, or skip any questions/procedures 
        that may make you feel uncomfortable, with no penalty to you, and no effect on the 
        compensation earned before withdrawing.
      </p>
    </section>

    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>If you have questions</strong></h3>
      <p class="indented align-left">
        The main researcher conducting this study is Jordan Wylie, a professor at Cornell University. 
        Please ask any questions you have now. If you have questions later, you may contact Professor 
        Jordan Wylie <a href="mailto:jordan.wylie@cornell.edu"><i class="fa-solid fa-envelope fa-xs"></i>&nbsp;jordan.wylie@cornell.edu</a>&nbsp;or <a href="tel:16072554486"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(607)&nbsp;255-4486</a>. If you have any questions or concerns regarding 
        our rights as a subject in this study, you may contact the Institutional Review Board (IRB) for 
        Human Participants <a href="tel:16072556182"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(607)&nbsp;255-6182</a> or access their 
        website <a href="https://researchservices.cornell.edu/offices/IRB" rel="noopener" target="_blank">researchservices.cornell.edu/offices/IRB&nbsp;<i class="fa-solid fa-arrow-up-right-from-square fa-xs"></i></a>. 
        You may also report your concerns or complaints anonymously online via 
        NAVEX <a href="http://www.hotline.cornell.edu" rel="noopener" target="_blank">hotline.cornell.edu&nbsp;<i class="fa-solid fa-external-link fa-xs"></i></a>
        or by calling toll free <a href="tel:18662933077"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(866)&nbsp;293-3077</a>. NAVEX is an independent organization
          that serves as a liaison between the University and the person bringing the complaint 
          so that anonymity can be ensured.
      </p>
    </section>
    
    <section>
      <p class="indented align-left" style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
        <strong>Statement of consent</strong><br>
        I have read the above information, and have received answers to any questions I asked. 
        I consent to take part in the study. 
      </p>
    </section>`,
  questions: [
    { 
      name: 'consent',
      format: { 
        type: 'radio',
        mc_options: ["YES, I consent to participate in this study", "NO, I do not consent to participate in this study"],
      },
      requirements: { type: 'required' }
    }
  ],
  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (data.response.consent == "NO, I do not consent to participate in this study") {
      jsPsych.data.addProperties({
        consent: "no"
      });

      jsPsych.abortExperiment(
        `<p>
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>`
      );
    } else {
      jsPsych.data.addProperties({
        consent: "yes"
      });
    };
  }
};
timeline.push(block_consent_form);

// ---------------- PAGE 3 ---------------- //
const instruction_pages = [
  // 1. Introduction
  `<p class="align-left" style="margin-bottom: 1em;">Welcome to our study!</p>
  
  <p class="align-left">
    In this study, you will receive 3 pairs of images that share the same content: one painting and one photograph. 
  </p>`,

  // 2. Task Overview
  `<p class="align-left" style="margin-bottom: 1em;">
    The paintings are a selection of artworks displayed in an art gallery. The photos have been collected from the news media. These are real photographs and paintings; not AI-generated. The pairs of paintings and photos depict the same content. 
  </p>
  <p class="align-left" style="margin-bottom: 1em;">
    Please note that some descriptions include potentially disturbing content, including violence, sexual assault, or other sensitive topics.
  </p>
  <p class="align-left">
    Once you make your choice, you will be presented with whichever image you choose (i.e., if you choose to see the photo, you will be presented with the photo). There are no right or wrong answers, we are interested in your personal choice.
  </p>`,

  // 3. Advance
  `<p class="align-left">
    When you are ready to begin, please click the <strong style="color: #0B6ED0;">Next Page</strong> button to advance!
  </p>`
];

const page_instructions = {
  type: jsPsychWyLabSurvey,
  preamble: jsPsych.timelineVariable('full_html'), 
  button_label: 'Next Page'
};

const block_instructions = {
  timeline: [page_instructions],
  timeline_variables: instruction_pages.map((current_content, index) => {
    
    // 1. Retrieve all previous instructions
    const previous_content = instruction_pages.slice(0, index);
    
    // 2. Wrap previous instructions in the greyed-out class
    const greyed_out_html = previous_content
      .map(html => `<section class="jspsych-instructions-greyed-out">${html}</section>`)
      .join('');

    // 3. Combine them: Greyed out stuff + current active stuff
    return {
      full_html: `
        <main class="jspsych-survey-html-form-preamble jspsych-instructions">
          <h2>Study Instructions</h2>
          ${greyed_out_html}
          <section class="jspsych-instructions-active">
            ${current_content}
          </section>
        </main>`
    };
  }),
  randomize_order: false
};

timeline.push(block_instructions);



// ---------------- PAGE 4 ---------------- //
// STUDY INSTRUCTIONS
const block_comprehension_check = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <main>
      <div class="jspsych-instructions">
        <h2>Check Your Understanding</h2>
        
        <p>Before we begin, please answer the following question to confirm your understanding of the study instructions.</p>
      </div>
    </main>`,
  questions: [
    {
      name: 'comprehension_check',
      prompt: 'What will you be asked to do in this study?',
      format: { 
        type: 'radio',
        mc_options: [
          "Read descriptions and decide whether you'd like to view paintings or photos",
          "Watch videos and decide whether you'd like to continue watching",
          "Complete puzzles and decide whether you'd like to switch or keep playing"
        ],
      },
      requirements: {
        type: 'comprehension',
        correct_answer: 'Read descriptions and decide whether you\'d like to view paintings or photos',
      }
    }
  ],
  button_label: 'Next Page'
};
timeline.push(block_comprehension_check);

// ---------------- PAGE 5 ---------------- //
// MAIN TASK: PAINTING VS PHOTOGRAPH CHOICE
// Create trials for each stimulus
const choice_trials = task_stimuli.map((stimulus, index) => {
  return {
    trial_number: index + 1,
    stimulus: stimulus
  };
});

// Page 1: Choice between painting and photograph
const page_choice = {
  type: jsPsychWyLabSurvey,
  preamble: jsPsych.timelineVariable('preamble_html'),
  questions: [
    {
      name: 'art_choice',
      prompt: 'Which would you prefer to view?',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: ['Painting', 'Photograph']
      },
      requirements: { type: 'request' }
    }
  ],
  button_label: 'Next Page',
  data: {
    scenario_name: jsPsych.timelineVariable('scenario_name'),
    painting_image: jsPsych.timelineVariable('painting_image'),
    photograph_image: jsPsych.timelineVariable('photograph_image')
  },
  on_finish: function(data) {
    data.choice = data.response['art_choice'];
  }
};

// Page 2: Display the selected image with survey questions below
const page_image_display = {
  type: jsPsychWyLabSurvey,
  preamble: '',
  questions: [
    {
      name: 'image_positive',
      prompt: 'This image is <strong><u>positive</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'image_negative',
      prompt: 'This image is <strong><u>negative</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'emotionally_aroused',
      prompt: 'This image makes me feel <strong><u>emotionally aroused</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'feel_upset',
      prompt: 'This image makes me feel <strong><u>upset</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'feel_distressed',
      prompt: 'This image makes me feel <strong><u>distressed</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'feel_worried',
      prompt: 'This image makes me feel <strong><u>worried</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'feel_moved',
      prompt: 'This image makes me feel <strong><u>moved</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'feel_sympathetic',
      prompt: 'This image makes me feel <strong><u>sympathetic</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'emotionally_drained',
      prompt: 'This image makes me feel <strong><u>emotionally drained</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'realistic_perspective',
      prompt: 'This image gives me a <strong><u>realistic perspective</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'aesthetically_pleasing',
      prompt: 'This image is <strong><u>aesthetically pleasing</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'reflect_moral_values',
      prompt: 'This image makes me <strong><u>reflect on my moral values</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'feel_awe',
      prompt: 'This image makes me feel <strong><u>awe</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'curious_learn_more',
      prompt: 'This image makes me <strong><u>curious to learn more about this situation</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'motivate_do_more',
      prompt: 'This image <strong><u>motivates me to do more about this situation</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'imagine_situation',
      prompt: 'This image <strong><u>helps me imagine what this situation is really like</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'want_see_more',
      prompt: 'This image makes me <strong><u>want to see more images like this</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'shows_actual_situation',
      prompt: 'This image <strong><u>shows me what this situation actually looks like</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'understand_scale',
      prompt: 'This image <strong><u>helps me understand the true scale of this situation</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    },
    {
      name: 'looking_other_way',
      prompt: 'This image makes me feel <strong><u>like I am looking the other way instead of engaging with this issue</u></strong>',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ]
      },
      requirements: { type: 'request' }
    }
  ],
  button_label: 'Next',
  data: {
    trial_type: 'image_display_survey'
  },
  on_start: function(trial) {
    try {
      // Find the last trial with painting_image and photograph_image
      const all_trials = jsPsych.data.get().values();
      let last_survey = null;
      
      for (let i = all_trials.length - 1; i >= 0; i--) {
        if (all_trials[i].painting_image && all_trials[i].photograph_image) {
          last_survey = all_trials[i];
          break;
        }
      }
      
      if (!last_survey) {
        trial.preamble = `<div style="text-align: center; padding: 40px;"><p>Error: Could not find previous survey response</p></div>`;
        return;
      }
      
      const choice = last_survey.choice;
      const painting_image = last_survey.painting_image;
      const photograph_image = last_survey.photograph_image;
      const image_path = choice === 'Painting' ? painting_image : photograph_image;
      
      trial.preamble = `
        <div class="sticky-image-container">
          <img src="${image_path}" style="max-width: 90%; max-height: 50vh; object-fit: contain;">
        </div>
        <div class="questions-container">
          <p style="font-size: 14pt; color: #666; margin-top: 20px;">Please rate your agreement with each statement below:</p>
        </div>
      `;
    } catch (e) {
      console.error('Error in on_start:', e);
      trial.preamble = `<div style="text-align: center; padding: 40px;"><p>Error: ${e.message}</p></div>`;
    }
  },
  on_finish: function(data) {
    const all_trials = jsPsych.data.get().values();
    let last_survey = null;
    
    for (let i = all_trials.length - 1; i >= 0; i--) {
      if (all_trials[i].painting_image && all_trials[i].photograph_image) {
        last_survey = all_trials[i];
        break;
      }
    }
    
    if (last_survey) {
      data.choice = last_survey.choice;
      data.scenario_name = last_survey.scenario_name;
    }
  }
};

// Timeline for each trial
const trial_timeline = [page_choice, page_image_display];
const randomized_choice_trials = jsPsych.randomization.shuffle(choice_trials);

const block_main_task = {
  timeline: trial_timeline,
  timeline_variables: randomized_choice_trials.map(trial => ({
    trial_number: trial.trial_number,
    scenario_name: trial.stimulus.scenario_name,
    painting_image: trial.stimulus.painting_image,
    photograph_image: trial.stimulus.photograph_image,
    preamble_html: `
      <main>
        <div class="jspsych-instructions">
          <p>Please decide whether you want to view a photo or painting of the following scenario:</p>
          <p style="font-size: 14pt; font-weight: bold; margin-top: 20px;">${trial.stimulus.scenario_name}</p>
        </div>
      </main>`
  })),
  randomize_order: true
};

timeline.push(block_main_task);

// ---------------- PAGE 5 ---------------- //
// SELF-REPORT SCALES - MCS (Macabre Curiosity Scale)
const block_mcs_questions = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "I am interested in seeing how limb amputation works.",
      name: 'mcs_1',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I would like to see how bodies are prepared for funerals.",
      name: 'mcs_2',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I am curious about crime and enjoy reading detailed news accounts about murders and other violent crimes.",
      name: 'mcs_3',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "My favorite part of a crime show is learning about why the killer did what he did.",
      name: 'mcs_4',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I prefer violent movies and TV shows to be uncensored.",
      name: 'mcs_5',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    const resp = data.response;
    jsPsych.data.addProperties({
      mcs_1: resp['mcs_1'] || '',
      mcs_2: resp['mcs_2'] || '',
      mcs_3: resp['mcs_3'] || '',
      mcs_4: resp['mcs_4'] || '',
      mcs_5: resp['mcs_5'] || '',
    });
  }
};
timeline.push(block_mcs_questions);

// ---------------- PAGE 6 ---------------- //
// SELF-REPORT SCALES - NFC-6 (Need for Cognition)
const block_nfc_questions = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "I would prefer complex to simple problems.",
      name: 'nfc_1',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I find satisfaction in deliberating hard and for long hours.",
      name: 'nfc_2',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I prefer to think about small, daily projects to long-term ones.",
      name: 'nfc_3',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "The notion of thinking abstractly is appealing to me.",
      name: 'nfc_4',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I like tasks that require little thought once I've learned them.",
      name: 'nfc_5',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I usually end up deliberating about issues even when they do not affect me personally.",
      name: 'nfc_6',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    const resp = data.response;
    jsPsych.data.addProperties({
      nfc_1: resp['nfc_1'] || '',
      nfc_2: resp['nfc_2'] || '',
      nfc_3: resp['nfc_3'] || '',
      nfc_4: resp['nfc_4'] || '',
      nfc_5: resp['nfc_5'] || '',
      nfc_6: resp['nfc_6'] || '',
    });
  }
};
timeline.push(block_nfc_questions);

// ---------------- PAGE 7 ---------------- //
// SELF-REPORT SCALES - Empathic Concern
const block_ec_questions = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "I often have tender, concerned feelings for people less fortunate than me.",
      name: 'ec_1',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Sometimes I don't feel very sorry for other people when they are having problems.",
      name: 'ec_2',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "When I see someone being taken advantage of, I feel kind of protective towards them.",
      name: 'ec_3',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Other people's misfortunes do not usually disturb me a great deal.",
      name: 'ec_4',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "When I see someone being treated unfairly, I sometimes don't feel very much pity for them.",
      name: 'ec_5',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I am often quite touched by things that I see happen.",
      name: 'ec_6',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I would describe myself as a pretty soft-hearted person.",
      name: 'ec_7',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    const resp = data.response;
    jsPsych.data.addProperties({
      ec_1: resp['ec_1'] || '',
      ec_2: resp['ec_2'] || '',
      ec_3: resp['ec_3'] || '',
      ec_4: resp['ec_4'] || '',
      ec_5: resp['ec_5'] || '',
      ec_6: resp['ec_6'] || '',
      ec_7: resp['ec_7'] || '',
    });
  }
};
timeline.push(block_ec_questions);

// ---------------- PAGE 8 ---------------- //
// SELF-REPORT SCALES - Personal Distress
const block_pd_questions = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "In emergency situations, I feel apprehensive and ill-at-ease.",
      name: 'pd_1',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I sometimes feel helpless when I am in the middle of a very emotional situation.",
      name: 'pd_2',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "When I see someone get hurt, I tend to remain calm.",
      name: 'pd_3',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Being in a tense emotional situation scares me.",
      name: 'pd_4',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I am usually pretty effective in dealing with emergencies.",
      name: 'pd_5',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "I tend to lose control during emergencies.",
      name: 'pd_6',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "When I see someone who badly needs help in an emergency, I go to pieces.",
      name: 'pd_7',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: [
      'Strongly disagree',
      'Moderately disagree',
      'Slightly disagree',
      'Neutral',
      'Slightly agree',
      'Moderately agree',
      'Strongly agree'
    ],
      },
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    const resp = data.response;
    jsPsych.data.addProperties({
      pd_1: resp['pd_1'] || '',
      pd_2: resp['pd_2'] || '',
      pd_3: resp['pd_3'] || '',
      pd_4: resp['pd_4'] || '',
      pd_5: resp['pd_5'] || '',
      pd_6: resp['pd_6'] || '',
      pd_7: resp['pd_7'] || '',
    });
  }
};
timeline.push(block_pd_questions);
// DEMOGRAPHICS
const block_demographics_questions = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  questions: [
    {
      prompt: "What is your age (in years)?",
      name: 'age',
      format: {
        type: 'number',
        number_min: 18,
        number_max: 120
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "With which gender do you identify?",
      name: 'gender',
      format: { 
        type: 'radio',
        mc_orientation: 'vertical',
        mc_options: [
          "Woman",
          "Man",
          "Non-binary",
          "Other:",
          "Prefer not to disclose"
        ],
        mc_write_in: ["Other:"],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Where would you place yourself on the political spectrum, overall?",
      name: 'politics',
      format: {
        type: 'slider',
        slider_direction: "bipolar",
        slider_color_scheme: "blue-red",
        slider_starting_value: 50,
        slider_range: [0, 100],
        slider_anchors: {
          left: 'Left-wing<br>(Liberal)', 
          center: 'Center', 
          right: 'Right-wing<br>(Conservative)'
        }
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "Please indicate how you identify yourself:",
      name: 'race-ethnicity',
      format: {
        type: 'checkbox',
        selection: 'multiple',
        mc_options: [
          "White",
          "African or African-American",
          "Hispanic/Latine",
          "Asian or Asian-American",
          "Indigenous American or Alaskan Native",
          "Native Hawaiian or other Pacific Islander",
          "Other:", 
          "Prefer not to disclose"
        ],
        mc_write_in: ["Other:"],
      },
      requirements: { type: 'request' }
    },
    {
      prompt: "To what extent do you consider yourself to be religious?",
      name: 'religion',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: ["Not at all religious", "Slightly religious", "Moderately religious", "Very religious"]
      },
      requirements: { type: 'request' }
    }
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    jsPsych.data.addProperties({
      age: data.response['age'],
      gender: data.response['gender'],
      gender_writein: data.response['gender-writein'] || '',
      politics: data.response['politics'],
      race_ethnicity: Array.isArray(data.response['race-ethnicity']) ? data.response['race-ethnicity'].join(", ") : data.response['race-ethnicity'],
      religion: data.response['religion']
    });
  }
};
timeline.push(block_demographics_questions);

// ---------------- PAGE 10 ---------------- //
// ATTENTION CHECK
const block_attention = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <p class="jspsych-survey-multi-choice-preamble">
      We appreciate your response to this question. Please be honest when answering, as your answer WILL NOT affect your payment or eligibility for future studies.
    </p>`,
  questions: [
    {
      prompt: `<strong>Overall, how much attention did you pay to this study while you were taking it?</strong>`,
      name: 'attention',
      format: {
        type: 'radio',
        mc_orientation: 'horizontal',
        mc_options: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Completely"]
      },
      requirements: { type: 'request' }
    },
  ],
  button_label: 'Next Page',
  on_finish: function(data) {
    switch (data.response['attention']) {
      case "1<br>Not at all":
        data.attention_num = 1;
        break;
      case "2":
        data.attention_num = 2;
        break;
      case "3":
        data.attention_num = 3;
        break;
      case "4":
        data.attention_num = 4;
        break;
      case "5":
        data.attention_num = 5;
        break;
      case "6":
        data.attention_num = 6;
        break;
      case "7<br>Completely":
        data.attention_num = 7;
        break;
    };
    jsPsych.data.addProperties({
      attention: data.attention_num
    })
  }
};
timeline.push(block_attention);

// ---------------- PAGE 11 ---------------- //
// DEBRIEFING
const block_debrief = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <section>
      <h2 style="text-align: center"><strong>Study Debriefing</strong></h2>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>What was this study about?</strong></h3>
      <p class="indented align-left">
        Our research lab is broadly interested in moral psychology—that is, better understanding the ways that moral judgments, moral states, and moral values, alongside other states, influence cognition and memory. Below are some of the specific questions we are currently exploring:
      </p>
    </section>
    <section>
      <ul>
        <li>How do moral states influence judgments, decision-making, and broader cognition?</li>
        <li>Do moral judgments and blame affect judgments, cognition, and memory?</li>
        <li>How does moral information influence the extent to which rules and rule-breakers should be punished?</li>
      </ul>
    </section>
    <section>
      <p class="indented align-left">
        Your participation helps us answer these questions, which in turn has implications for public figures, policy, and law. We are committed to sharing our research findings in ways that are accessible and relevant to the public.
      </p>
    </section>
    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>How to contact us</strong></h3>
      <p class="indented align-left">
        Feel free to visit our website <a href="https://www.jordancwylie.com/" target="_blank">jordancwylie.com&nbsp;<i class="fa-solid fa-external-link fa-xs"></i></a> to learn more about our research. If you have any concerns or questions about the study you just completed, please reach out to the lab <a href="mailto:jordan.wylie@cornell.edu"><i class="fa-solid fa-envelope fa-xs"></i>&nbsp;jordan.wylie@cornell.edu</a>.
      </p>
    </section>
    <section>
      <h3><i class="fa fa-2xs fa-chevron-circle-down"></i>&nbsp;<strong>To learn more about your rights as a research participant</strong></h3>
      <p class="indented align-left">
        If you have any concerns about research-related ethics or harm, or would like to learn more about the ethical constraints under which this study was conducted, 
        please contact the Cornell University Institutional Review Board (IRB) for Human Participants <a href="tel:16072556182"><i class="fa-solid fa-phone fa-xs"></i>&nbsp;+1&nbsp;(607)&nbsp;255-6182</a> or access their website <a href="https://researchservices.cornell.edu/offices/IRB" target="_blank">researchservices.cornell.edu/offices/IRB&nbsp;<i class="fa-solid fa-external-link fa-xs"></i></a>. Thank you for your participation!
      </p>
    </section>`,
  questions: []
};
timeline.push(block_debrief);

// ---------------- PAGE 12 ---------------- //
// COMMENTS AND FEEDBACK
const block_feedback = {
  type: jsPsychWyLabSurvey,
  questions: [
    {
      format: { 
        type: "essay",
        essay_rows: 10,
        essay_cols: 40
      },
      name: 'feedback',
      prompt:
        `<p class="jspsych-survey-multi-choice-question">
          Please use this space for any additional thoughts or comments.<br>
          <span style="font-size: 10pt;">
            We read everything and appreciate your feedback!
          </span>
        </p>`,
    }
  ],
  on_finish: function (data) {
    data.feedback = data.response['feedback'];
  }
};
timeline.push(block_feedback);


// ---------------- END EXPERIMENT ---------------- //
// EXIT FULLSCREEN
const exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0,
};
timeline.push(exit_fullscreen);

const participant_data_csv = () => {
  const trial_data = jsPsych.data.get().values();
  const participant_data = {
    trial_type: 'participant',
    trial_index: 0,
    time_elapsed: trial_data.at(-1)?.time_elapsed || '',
    internal_node_id: 'participant',
    rt: trial_data.reduce((total, trial) => total + (Number(trial.rt) || 0), 0),
    response: JSON.stringify(trial_data.map((trial) => trial.response).filter(Boolean))
  };
  const shared_fields = new Set([
    'participant_id',
    'study_id',
    'session_id',
    'consent',
    'mcs_1', 'mcs_2', 'mcs_3', 'mcs_4', 'mcs_5',
    'nfc_1', 'nfc_2', 'nfc_3', 'nfc_4', 'nfc_5', 'nfc_6',
    'ec_1', 'ec_2', 'ec_3', 'ec_4', 'ec_5', 'ec_6', 'ec_7',
    'pd_1', 'pd_2', 'pd_3', 'pd_4', 'pd_5', 'pd_6', 'pd_7',
    'age', 'gender', 'gender_writein', 'politics', 'race_ethnicity', 'religion',
    'attention'
  ]);

  trial_data.forEach((trial, trial_index) => {
    Object.entries(trial).forEach(([key, value]) => {
      if (['response', 'trial_type', 'trial_index', 'time_elapsed', 'internal_node_id', 'rt'].includes(key)) return;

      const column = shared_fields.has(key) ? key : `trial_${trial_index + 1}_${key}`;
      participant_data[column] = Array.isArray(value) ? value.join(', ') : value;
    });

    if (trial.response && typeof trial.response === 'object' && !Array.isArray(trial.response)) {
      Object.entries(trial.response).forEach(([key, value]) => {
        const column = `trial_${trial_index + 1}_${key}`;
        participant_data[column] = Array.isArray(value) ? value.join(', ') : value;
      });
    }
  }); 

  const escape_csv_value = (value) => {
    const string_value = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(string_value) ? `"${string_value.replace(/"/g, '""')}"` : string_value;
  };
  const columns = Object.keys(participant_data);

  return [
    columns.map(escape_csv_value).join(','),
    columns.map((column) => escape_csv_value(participant_data[column])).join(',')
  ].join('\n');
};

// DataPipe conclude data collection
const block_save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "2zIg9auDiJQH",
  filename: filename,
  data_string: participant_data_csv,
  on_finish: function(data) {
    if (data.success) {
      console.log(`DataPipe saved ${filename}`);
    } else {
      console.error('DataPipe failed to save data:', data.result);
      const error_message = data.result?.message || data.result?.error || 'Unknown DataPipe error';
      jsPsych.abortExperiment(
        `<p>We could not save your responses. Please do not close this page and contact the researcher with this message:</p><p>${error_message}</p>`
      );
    }
  }
};
timeline.push(block_save_data); 

// --- redirect to Prolific with countdown timer ---
const block_redirect = {
  type: jsPsychWyLabSurvey,
  preamble: `
    <div style="text-align: center;">
      <h2>Thank you for participating!</h2>
      <p>You will be redirected to Prolific in <span id="countdown">5</span> seconds...</p>
      <p>If you are not redirected automatically, please click <a href="https://app.prolific.com/submissions/complete?cc=${prolific_completion_code}" target="_blank">here&nbsp;<i class="fa-solid fa-external-link fa-xs"></i></a>.</p>
    </div>
  `,
  questions: [],
  on_load: function() {
    let timeLeft = 5;
    const timer = setInterval(function() {
      timeLeft--;
      const display = document.querySelector('#countdown');
      if (display) { display.innerHTML = timeLeft; }
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        window.location.href = `https://app.prolific.com/submissions/complete?cc=${prolific_completion_code}`;
      }
    }, 1000);
  }
};
timeline.push(block_redirect);

startExperiment();

// Function to initialize the experiment
function startExperiment() {
  jsPsych.run(timeline);
};

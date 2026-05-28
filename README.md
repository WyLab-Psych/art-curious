# WyLab JsPsych
The WyLab uses an opinionated jsPsych styling and modular experimental design paradigm encapsulated in a single plugin, the WyLab Survey plugin, which accommodates the following question types in addition to custom HTML for arbitrarily complex questions:

* Multiple Choice
* Numeric Entry
* Slider
* Short Response
* Long Essay Response

Additionally, questions can include the following response requirements on top of the default of none:

* Request Response
* Require Response
* Comprehension Check

## Question Formats

#### Global Parameters

All questions share the same basic structure and several global question-level parameters.
<dl> 
    <dt><code>prompt</code> : the question as worded for participants</dt>
    <dd>The question</dd>
    <dt><code>name</code> : internal question name</dt>
    <dd>The name of the question, which will be outputted as a column name in the data</dd>
    <dt><code>format</code> : a dictionary with the question type and its parameters</dt>
    <dd>The type of input that the question represents (e.g., slider) as well as the format-specific parameters (e.g., maximum word count)</dd>
</dl>

### Radio (Single-Select)

```{javascript}
format: {
    type: 'radio',
    mc_orientation: 'horizontal'
    mc_options: ["Not at all religious", "Slightly religious", "Moderately religious", "Very religious"]
}
```
#### Radio Parameters

<dl> 
    <dt><code>type</code> : radio</dt>
    <dt><code>mc_orientation</code> : the orientation of the question options</dt>
    <dd>default="vertical" | "horizontal"</dd>
    <dt><code>mc_options</code> : the question options in array format</dt>
    <dd>default=[] | ["Option 1", "Option 2", ... "Option N"]</dd>
    <dt><code>mc_writein</code> : the question options, if any, which allow for a write-in option</dt>
    <dd>default=[] | ["Option 1", "Option 2", ... "Option N"]</dd>
</dl>

### Numeric Entry
```
format: {
    type: 'number',
    number_min: 0,
    number_max: 200,
    number_step: 2
}
```

#### Numeric Entry Parameters

<dl> 
    <dt><code>type</code> : number</dt>
    <dt><code>number_min</code> : the minimum acceptable numeric value</dt>
    <dd>default=0 | any positive integer</dd>
    <dt><code>number_max</code> : the maximum acceptable numeric value</dt>
    <dd>default=100 | any positive integer</dd>
    <dt><code>number_step</code> : the step between values</dt>
    <dd>default=1 | any positive number</dd>
</dl>

### Slider
```
format: {
    type: 'slider',
    slider_direction: "unipolar",
    slider_color_scheme: "purple",
    slider_starting_value: 0,
    slider_range: [0, 100],
    slider_anchors: {
        left: "not at all",
        center: "",
        right: "completely",
    },
}
```

#### Slider Parameters

<dl> 
    <dt><code>type</code> : number</dt>
    <dt><code>slider_direction</code> : the minimum acceptable numeric value</dt>
    <dd>default="unipolar" | "bipolar"</dd>
    <dt><code>slider_color_scheme</code> : the color(s) for the endpoint(s)</dt>
    <dd>default="purple" | any HEX code or default color name</dd>
    <dt><code>slider_starting_value</code> : the default starting value, which is only recorded if participants actually click on it</dt>
    <dd>default=0 | any number</dd>
    <dt><code>slider_range</code> : the range of the scale, inclusive</dt>
    <dd>default=[0, 100] | any range of numbers</dd>
    <dt><code>slider_anchors</code> : optional slider anchors at left, middle, and right</dt>
    <dd>default={left: "", center: "", right: ""} | any text</dd>
</dl>

### Short Response
```
format: {
    type: 'short_text',
    short_text_max_length: null
    short_text_placeholder: ""
}
```

#### Short Response Parameters

<dl> 
    <dt><code>type</code> : short_text</dt>
    <dt><code>short_text_max_length</code> : the maximum length for a short response question</dt>
    <dd>default=null | any number as a character length</dd>
    <dt><code>short_text_placeholder</code> : the default text inserted into the short response answer box</dt>
    <dd>default="" | any text</dd>
</dl>

### Essay
```
format: {
    type: 'short_text',
    essay_rows: 5,
    essay_cols: 40,
    essay_max_length: null,
    essay_placeholder: ""
}
```

#### Essay Parameters

<dl> 
    <dt><code>type</code> : essay</dt>
    <dt><code>essay_rows</code> : the number of rows for the essay box</dt>
    <dd>default=5 | any number</dd>
    <dt><code>essay_cols</code> : the number of columns for the essay box</dt>
    <dd>default="40" | any number</dd>
    <dt><code>essay_max_length</code> : the maximum length for a essay question</dt>
    <dd>default=null | any number as a character length</dd>
    <dt><code>essay_placeholder</code> : the default text inserted into the essay box</dt>
    <dd>default="" | any text</dd>
</dl>
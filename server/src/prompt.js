const quizDescription = {
    "MC": "the quiz includes one question and 4 answer candidates for each main point above, \
            The first candidate must be the correct answer.",
    "TF": "For each main point above, give one corrent statement and one false statement about the main point",
};

export function QGPrompt(language, task) {
    return `
        give me a quiz for this passage in language:${language} 
        ${quizDescription[task]}
    `;
}

export function mainpointsPrompt(language, passage, n) {
    return `
        '''${passage}'''

        list ${n ?? 'about 5-10'} main points in this passage in language: ${language} 
    `;
}

export function keywordsPrompt(language, passage) {
    return `
        '''${passage}'''

        give special and difficult terms in this passage which is highly specific to the topic
        output in language ${language} without explanation
        These keywords must be things or concepts that are indispensable to the understanding of the meaning of this text,
        rather than simply a noun or an action.
        these keywords must appear in the text so we can find out the word directly from the input text instead of synonyms
        must use language ${language}, use the format: word, word, word
    `;
}

export function definitionPrompt(language) {
    return `
        give me the definition of the keywords above based on the contextual meaning in the original text rather than the general meaning
        Must not include the keyword in the definition
        Use language: ${language}
    `;
}

export function clozeParagraphPrompt(language) {
    return `
        with all keywords above, write a short summary paragraph that uses all the keywords. Mark the keyword used with <>. use language ${language}
    `;
}

export function clozePrompt(language) {
    return `
        with each keyword above, write a summary sentence that contains the keyword. Use language: ${language}
    `;
}

export function sopPrompt(language, passage) {
    return `
Given the article:
<Start of the article>
This is Kenji Lopez Alt,
and I'm going to read you a passage from Marco Pierre White's book The Devil in the kitchen.
Visualize the fried egg.
Do you want it to be burned around the edges?
Do you want to see craters on the egg whites?
The answer to these questions should be no.
Yet the majority of people still crack an egg and drop it into searingly hot oil or fat and continue to cook it on high heat.
The result is an inedible destruction of that great ingredient,
the egg. Maybe that's how you like it,
in which case carry on serving your disgusting food.
Marco then goes on to explain how he actually fries an egg so he melts butter at a very low.
Temperature then slides the egg into it,
and if the egg makes any noise at all,
that means that the pan is too hot.
What you end up is is sort of these picture perfect,
the type of eggs that the egg board wants you to see.
No color around the whites and a perfectly smooth surface.
I don't like my fried eggs this way.
I think people who do just can't admit that they want poached eggs and hollandaise,
and you might as well just eat that.
When I'm frying my egg,
I actually wanted to taste fried.
Now I'm showing you this technique.
Used plenty of oil in a very hot pan.
I'm using carbon steel here,
but you can use cast iron or nonstick,
and once you slide the into the pan,
you kind of tilt the pan up towards you and spoon that hot fat all over it all around the whites,
which are kind of cooking the egg from both sides so that it cooks really,
really quickly,
just about 45 seconds to a minute or so.
So the inside of the egg remains really nice and tender,
while the outside gets a nice crisp brown texture.
And to me that is the superior way to fry eggs.
It actually tastes fried and you get that textural contrast and that flavor contrast.
And of course you still get that nice soft creamy yolk.
Make sure you check out the description below for a link to the recipe on serious eats.
Now if you happen to like serving your eggs picture perfect and pure white with no texture at all,
you can just carry on serving your disgusting food.
<End of the article>

and I List steps introduced in the article above chronologically in language en:
<Start of the output>
1. Heat plenty of oil in a very hot pan.
2. Use carbon steel, cast iron, or nonstick pan.
3. Crack the egg into the hot oil.
4. Tilt the pan towards you and spoon the hot oil over the egg whites.
5. Cook for about 45 seconds to a minute.
6. The inside of the egg should remain tender while the outside gets a nice crisp brown texture.
7. Serving the egg
<End of the output>

List steps introduced in the following article chronologically in language ${language}, each step must be a short instruction like in wikihow:
<Start of the article>
${passage}
<End of the article>

<Start of the output>
    `;
}

export function diagramPrompt(language, sop) {
    return `
Generate a flowchart using valid mermaid.js syntax that shows the process of the following SOP:
Example:
<sop>
1. Prepare dataset
2. Preprocess dataset
3. Split the dataset into training set, testing set and validation set
4. Select your model. 
5. You can train a new model from scratch.
6. You can also choose a pretrained model to finetune.
7. Fit the model with training dataset
8. Evaluate the model on validation set
9. If result improves, save the model checkpoint and continue training
10. Stop training if overfit
11. If you don't have dataset, you can look for open-source dataset or generate synthetic data
</sop>
\`\`\`mermaid
graph TD
1["Prepare dataset"]-->2["Preprocess dataset"]
2-->3["Split the dataset into training set, testing set and validation set"]
3-->4["Select model"]
4-->5["Train a new model"]
4-->6["Choose a pretrained model"]
5-->7["Fit the model with training dataset"]
6-->7
7-->8["Evaluate the model on validation set"]
8-->|"Result Improves"|9["Save the model checkpoint"]
9-->7
8-->|"Overfit"|10["Stop Training"]
1-->11["No dataset"]-->12["Look for open-source dataset"]
11-->13["generate synthetic data"]
12-->3
13-->3
\`\`\`
-------------------------
<sop>
${sop}
</sop>
    `;
}

export function MCPrompt(language, passage, n, topic) {
    return `
You are a quiz creator of highly diagnostic quizzes. You will make good low-stakes tests and diagnostics.
You will construct ${n} different multiple-choice questions about ${topic} based on the passage, each question should come with 4 answer candidates.
The audience for the quiz are workers who are asked to strictly follow the SOP, pay attention to the details and cautions.
these quiz should be answerable with this passage instead of the external knowledge.
Using only the provided passage and to cite the sentence in the passage used to generate question. Every question must be annotated with a citation. Use the following format for to cite relevant passages ({{"context": …}}). The reference sentences must exactly match substring in the passage, including cases, punctuation and spaces.
At the end of each quiz, you will provide an answer, the answer must be exactly same with one of the options.

Follow the guidelines when constructing questions:
- Each questions should be independent and not repetitive
- Ask only one thing in each questions
- Use active voice instead of passive voice
- Avoid giving hints to correct answer in the questions, or mentioning any options
- Ask more questions about details or concept that the audience may get wrong
- Avoid questions that can be easily answered with common sense

Follow the guidelines when constructing options:
- Each options or answer candidate should be independent amd mutually exclusive
- All options should be plausible, competitive alternate responses to the questions in common sense. The questions can only be answer with the knowledge in the passage.
- The length of each options should be similar.
- Make sure that only one of the options / answer candidate is correct according to the passage
- Sort the options logically. for example: if the options includes numbers, sort them ascendingly.
- Do not include "None of the above", "All of the above", "I don't know" in the options
- Do not use certains words like "always", "never", "completely" in the options

Below is the passage:
=====
${passage.replace('\n', ' ')}
=====
Use language:${language} to generate the quiz
    `;
}

export function TFPrompt(language, passage, n, topic) {
    return `
You are a quiz creator of highly diagnostic quizzes. You will make good low-stakes tests and diagnostics.
You will construct ${n} different True or False questions about ${topic} based on the passage, each question should come with 1 true statement and 1 false statement
The statements must be detailed and specific, provide enough context to make the statement true or false.
The audience for the quiz are workers who are asked to strictly follow the SOP, pay attention to the details and cautions.
these quiz should be answerable with this passage instead of the external knowledge.
Using only the provided passage and to cite the sentence in the passage used to generate question. Every question must be annotated with a citation. Use the following format for to cite relevant passages ({{"context": …}}). The reference sentences must exactly match substring in the passage, including cases, punctuation and spaces.
At the end of each quiz, you will provide an answer, the answer must be exactly same with one of the options.

Follow the guidelines when constructing questions:
- Each questions should be independent and not repetitive
- Ask only one thing in each questions
- Use active voice instead of passive voice
- Avoid giving hints to correct answer in the questions, or mentioning any options
- Ask more questions about details or concept that the audience may get wrong
- Avoid questions that can be easily answered with common sense

Follow the guidelines when constructing true and false statements:
- Each true and false statements should be independent amd mutually exclusive
- All statements should be plausible, competitive alternate responses to the questions in common sense. The questions can only be answer with the knowledge in the passage.
- The length of each statements should be similar.
- Make sure that only one of the statements is true according to the passage
- Do not directly write the false statement as the negation of the true statement, for example: 
    true_statement: "The sky is blue",
    false_statement: "The sky is red" (instead of "The sky is not blue")

Below is the passage:
=====
${passage.replace('\n', ' ')}
=====
Use language:${language} to generate the quiz
    `;
}

export function editPrompt(task, topic, passage) {
    switch (task) {
        case "Add":
            return `Besides the questions above, generate 1 ~ 5 more questions about ${topic}.
these questions should be answerable with this passage instead of the external knowledge. Use only facts that are mentioned in the passage.
Follow the guidelines given above when constructing questions and options. 
Output 1 ~ 5 new questions only, do not repeat questions that are already in the quiz.`;

        case "Selection":
        return `Add 1 ~ 2 more question about ${topic} based on the passage below:
'''
${passage}
'''
these questions should be answerable with this passage instead of the external knowledge. Use only facts that are mentioned in the passage.
Follow the guidelines given above when constructing questions and options. Do not repeat questions that are already in the quiz.`;

        case "Enhance":
            return `Enhance the question above to follow the guidelines:
- The question and the options should be relevant and correct according to the passage
- Each questions should be independent and not repetitive
- Ask only one thing in each questions
- Use active voice instead of passive voice
- Avoid giving hints to correct answer in the questions, or mentioning any options
- Ask more questions about details or concept that the audience may get wrong
- Avoid questions that can be easily answered with common sense

Use the same language as the question above to generate the quiz`;

        case "Expand":
            return `This question is not concise enough. Find relevant procedures to the question from the passage, then expand the question above to include more relevant context and necessary details to make the question more concise and clear
For example:
- INPUT: "question: How long should we wait?"
Relevant procedures: "Put the cake in the oven and bake it. Wait for 30 minutes. Take out the cake."
OUTPUT: "question: How long should we wait for the cake to bake?"
- INPUT: "question: What is the color?"
Relevant procedures: "Put the powder into the mixture. The color of the mixture changes to red."
OUTPUT: "question: What is the color of the mixture after putting the powder into the mixture?"

The output question should be longer than the input question and contain more details and context.
`;

        case "Shorten":
            return `Simplify and shorten the question above to make them more concise and easier to understand`;

        case "Topic":
            return `Find related context to the question, then ask a question about ${topic} based on same passage as the question above`;

        case "Regenerate options":
            return `Generate 4 options for the question above.
Follow the guidelines:
- The answer should be relevant and correct according to the passage
- Each options or answer candidate should be independent amd mutually exclusive
- All options should be plausible, competitive alternate responses to the questions in common sense. The questions can only be answer with the knowledge in the passage.
- The length of each options should be similar.
- Make sure that only one of the options / answer candidate is correct according to the passage
- Sort the options logically. for example: if the options includes numbers, sort them ascendingly.
- Do not include "None of the above", "All of the above", "I don't know" in the options
- Do not use certains words like "always", "never", "completely" in the options
- One of the options must be the correct answer, the answerId should be the index of the correct answer, one of 0, 1, 2, 3`;

        case "Regenerate":
            return `Rewrite another true statement and another false statement for the same context of the question above. Follow the guidelines:
- Each true and false statements should be independent amd mutually exclusive
- All statements should be plausible, competitive alternate responses to the questions in common sense. The questions can only be answer with the knowledge in the passage.
- Make sure that only one of the statements is true according to the passage
- Do not directly write the false statement as the negation of the true statement, for example:
    true_statement: "The sky is blue",
    false_statement: "The sky is red" (instead of "The sky is not blue")`;

        case "Ask differently":
            return `Ask the same question in a different way by switching the subject of question and the answer
for example:
- INPUT: "question: What is John's favorite food? answer: Pizza" 
OUTPUT: "question: Who is a fan of pizza? answer: John"
- INPUT: "question: How to become healthy? answer: Exercise regularly" 
OUTPUT: "question: Why exercise regularly? answer: To become healthy"
- INPUT: "question: What is the capital of France? answer: Paris" 
OUTPUT: "question: Paris is the capital of which country? answer: France"
- INPUT: "question: Why exercise regularly? answer: To become healthy" 
OUTPUT: "question: How to become healthy? answer: Exercise regularly"
- INPUT: "question: Why do we need to wear a mask? answer: To prevent the spread of COVID-19" 
OUTPUT: "question: How to prevent the spread of COVID-19? answer: Wear a mask"
- INPUT: "question: What to do next after analyzing the data? answer: write a report" 
OUTPUT: "question: What to do before writing a report? answer: Analyze the data"`;

        case "Why <-> How":
            return `Change the question above from "Why" to "How" or from "How" to "Why"
for example:
- "question: How to become healthy? answer: Exercise regularly" 
OUTPUT: "question: Why exercise regularly? answer: To become healthy"
- "question: Why exercise regularly? answer: To become healthy" 
OUTPUT: "question: How to become healthy? answer: Exercise regularly"
- "question: Why do we need to wear a mask? answer: To prevent the spread of COVID-19" 
OUTPUT: "question: How to prevent the spread of COVID-19? answer: Wear a mask"
- "question: How to prevent the spread of COVID-19? answer: Wear a mask" 
OUTPUT: "question: Why do we need to wear a mask? answer: To prevent the spread of COVID-19"`;

        case "Before <-> After":
            return `Change the question above from "Before" to "After" or from "After" to "Before"
for example:
- "question: What to do next after analyzing the data? answer: write a report" 
OUTPUT: "question: What to do before writing a report? answer: Analyze the data"
- "question: What to do before writing a report? answer: Analyze the data" 
OUTPUT: "question: What to do next after analyzing the data? answer: write a report"
- INPUT: "What should be done before adding the eggs? answer: Heat the pan"
OUTPUT: "What should be done after heating the pan? answer: Add the eggs"`;
    }
}
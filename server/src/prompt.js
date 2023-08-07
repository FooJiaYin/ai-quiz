import schema from "./schema.js";

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
    `
}
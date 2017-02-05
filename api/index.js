/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports en-US lauguage.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-trivia
 **/

'use strict';

const Alexa = require('alexa-sdk');
const answers = [
    ',The sky is very high',
    ',Adam and Eve messed up',
    ',We have faith in humanity',
    ',The media is biased',
    ',We think we know everything',
    ',Everyone was sleeping',
    'of Quantum fluctuation',
    'of Global warming',
    ',It is politically correct',
    ',It is what it is',
    ',It is the right thing',
    ',It is a fact of life',
    ',Weed is not legal',
    'of Tradition',
    ',There is no choice',
    ',what goes around,comes around',
    ',It is funny',
    'of Evolution',
    ',Life is not about winning, it\'s about surviving',
    'of the same reason why water boils at 100 centigrade',
    'of the same reason why we don\'t have tails',
    'of the same reason why we wake up every morning',
    'of the same reason why I chose to be a woman',
    ',hmmm  <break time="1s"/>  I don\'t know'
];
const preanswers = ['That is because'
,'Generally That is because'
, 'Many People believe that is because'
, 'Because'
, 'Research has shown that it\'s because'
,'Based on an extensive research from university of wacha ma call it,it\'s because'
,'Based on survey done on 10000 individuals,it\'s because'
,'Using deductive reasoning, that is because'];

const GAME_NAME = 'WhyBecause'; 
const GAME_STATES = {
    QUESTION: '_QUESTIONMODE', 
    START: '_STARTMODE', 
    HELP: '_HELPMODE', 
};
const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL)

function getRandomAnswer(){
    //return 'That is because the sky is very very high';
    //get random preanswer
    const answerRandomIndex = Math.floor(Math.random() * answers.length);
    const preanswerRandomIndex = Math.floor(Math.random() * preanswers.length);

    return preanswers[preanswerRandomIndex]+" "+answers[answerRandomIndex];
}

const newSessionHandlers = {
    /**
     * Entry point. Start a new game on new session. Handle any setup logic here.
     */
    'NewSession': function () {
       
        this.handler.state = GAME_STATES.START;
        if (this.event.request.type === 'LaunchRequest') {
            this.emitWithState('StartGame', true);
        } else if (this.event.request.type === 'IntentRequest') {
            console.log(`current intent: ${this.event.request.intent.name
                }, current state:${this.handler.state}`);
            const intent = this.event.request.intent.name;
            this.emitWithState(intent);
        }
    },

    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
};

const createStateHandler = Alexa.CreateStateHandler;

const startStateHandlers = createStateHandler(GAME_STATES.START, {
    'StartGame': function (newGame) {
        let speechOutput ='Ask me a question starting with Why';
        this.handler.state = GAME_STATES.QUESTION;
        this.emit(':ask', speechOutput);
    },
     'WhyQuestionIntent': function () {
        let speechOutput = getRandomAnswer();
        this.handler.state= GAME_STATES.QUESTION;
        this.emit(':tell',speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState('helpTheUser', true);
    },
    'Unhandled': function () {
        this.emit('StartGame', true);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
     'AMAZON.StopIntent': function () {
        const speechOutput = 'I hope you find your reason, Good Bye!';
        this.emit(':tell', speechOutput);
    },
});

const questionStateHandlers = createStateHandler(GAME_STATES.QUESTION, {
    'WhyQuestionIntent': function () {
        let speechOutput = getRandomAnswer();
        this.emit(':tell',speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.StopIntent': function () {
         const speechOutput = 'I hope you find your reason, Good Bye!';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        const speechOutput = 'I hope you find your reason, Good Bye!';
        this.emit(':tell', speechOutput);
    },
    'Unhandled': function () {
         let speechOutput = 'I don\'t understand, but, '+getRandomAnswer();
        this.emit(':tell',speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
});

const helpStateHandlers = createStateHandler(GAME_STATES.HELP, {
    'helpTheUser': function (newGame) {
         this.handler.state = GAME_STATES.QUESTION;
         const askMessage ='this is your voice of reason, please go ahead and ask me a question beginning with, why?';
        this.emit(':ask', askMessage);
    },
    'StartGame': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emitWithState('helpTheUser');
    },
    'AMAZON.HelpIntent': function () {
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.StopIntent': function () {
          const speechOutput = 'I hope you find your reason, Good Bye!';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = GAME_STATES.QUESTION;
        this.emitWithState('AMAZON.RepeatIntent');
    },
    'Unhandled': function () {
         let speechOutput = 'I don\'t understand, but, '+getRandomAnswer();
        this.emit(':tell',speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
});

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, questionStateHandlers,helpStateHandlers);
    alexa.APP_ID = APP_ID;
    alexa.execute();
};

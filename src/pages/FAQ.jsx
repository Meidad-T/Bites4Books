import React from 'react';
import { Heart, Star, Code, Smile } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: "Why are we doing it?",
      icon: <Heart size={28} />,
      answer: `"I was thinking for hours - how can I make your journey easier?" and to me, sitting back and listening wasn't enough. so, I decided to make you the website with books as an incentive.\n\nYou love books, and I love your happiness and well-being, so its a win win!`
    },
    {
      question: "Point system",
      icon: <Star size={28} />,
      answer: `every 200 points will be a book! I know it feels like a ton, BUT if you eat 3 meals a day, it's 1 book per week! should be pretty cool. In fact, there may also be a milestone bonus one day, so keep logging!`
    },
    {
      question: "Tech Stack (are you a nerd? why would you read it?)",
      icon: <Code size={28} />,
      answer: `hehe anyways, this site is using React components and your data (points) is being handled by Firebase. Your Google Account sign-in is authenticated using Firebase as well.\n\nThe main reason I used firebase, is for saving your points so they are consitent across all devices in real-time, as well as being able to "award" you points through my admin power (I am cool right?).`
    },
    {
      question: "Do I have to do this?",
      icon: <Smile size={28} />,
      answer: `Not at all. you don't have to do it, I just wanted to try and provide an incentive to getting healthier, since I believe it is a journey you would go through anyways... might as well enjoy some books (alongside other support from me). But this is just a tool to make it go a bit easier is all...`
    }
  ];

  return (
    <div className="page-container faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>A little bit of background on why this exists! ❤️</p>
      </div>

      <div className="faq-grid">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-card">
            <div className="faq-icon-wrapper">
              {faq.icon}
            </div>
            <div className="faq-content">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

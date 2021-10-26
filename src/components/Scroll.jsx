import React,{ useEffect, useRef } from 'react';


import '../css/Scroll.css';

const Scroll = () => {

    const messagesEndRef = React.createRef();

    useEffect(()=>{
        messagesEndRef.current.scrollIntoView({behavior:'auto'});
    });

    return (
        <div className="box">
            <div className="boxcontent">
                <div className="boxtext" >
                <div >

                Virat Kohli (Hindustani: [ʋɪˈɾɑːʈ ˈkoːɦliː] (About this soundlisten); born 5 November 1988) is an Indian cricketer who is the current captain of the India national team. He plays for Delhi in domestic cricket and Royal Challengers Bangalore in the Indian Premier League (IPL) as a right-handed batsman. He is considered one of the best batsmen of his generation.[2]
                </div>
                <div>

                Kohli captained India Under-19s to victory at the 2008 Under-19 World Cup in Malaysia. A few months later, he made his ODI debut for India against Sri Lanka at the age of 19. Initially having played as a reserve batsman in the Indian team, he soon established himself as a regular middle-order batsman in the ODI and was part of the squad that won the 2011 Cricket World Cup. He made his Test debut in 2011 and shrugged off the tag of "ODI specialist" by 2013 with Test hundreds in Australia and South Africa.[3] Having reached the number one spot in the ICC rankings for ODI batsmen for the first time in 2013,[4] Kohli also found success in the Twenty20 format, winning the Man of the Tournament twice at the ICC World Twenty20 (in 2014 and 2016).
                </div>

                <div>

                Kohli was appointed the vice-captain of the ODI team in 2012 and handed over the Test captaincy following MS Dhoni's Test retirement in 2014. In January 2017, he became the limited-overs captain after Dhoni stepped down from the position. In ODIs, Kohli has the second-highest number of centuries and the highest number of centuries in run-chases in the world. He holds the world record for being the fastest batsman to 8,000, 9,000, 10,000, 11,000 and 12,000 runs in ODI cricket. He also holds the world record of being the fastest to 23,000 international runs.[5] Among Indian batsmen, he has the best Test rating (937 points), ODI rating (911 points) and T20I rating (897 points).
                </div>

                <div ref={messagesEndRef}>

                Kohli has been the recipient of many awards such as the Sir Garfield Sobers Trophy (ICC Cricketer of the Year) in 2017 and 2018; ICC Test Player of the Year 2018; ICC ODI Player of the Year in 2012, 2017 and 2018 and Wisden Leading Cricketer in the World in 2016, 2017 and 2018.[6] He was given the Arjuna Award in 2013, the Padma Shri under the sports category in 2017[7] and the Rajiv Gandhi Khel Ratna award, the highest sporting honour in India, in 2018.[8] He is ranked as one of the world's most famous athletes by ESPN[9] and one of the most valuable athlete brands by Forbes.[10] In 2018, Time magazine named him one of the 100 most influential people in the world.[11] In 2020, he was ranked 66th in Forbes list of the top 100 highest-paid athletes in the world for the year 2020 with estimated earnings of over $26 million.
                </div>
                {/* <button onClick={()=>messagesEndRef.current.scrollIntoView({behavior:'auto'})}>click</button> */}
                </div>
            </div>
            <div>
            </div>
        </div>
    );
}
 
export default Scroll;
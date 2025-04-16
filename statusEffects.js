/*
This file may seem borderline useless, but understand that many of 
the variant weapons inflict a status effect.

*/
const statusEffects = [
    {
        name:'slow',
        mod:{
            speed:0.5,
            swing:0.75,
        },
        dot:{
            damage:0,

        },
        filter:'',
        particles:{
            speed:0,
            type:0,
        }
    },
    {
        name:'stun',
        mod:{
            speed:0,
            swing:0,
        },
        dot:{
            damage:0,

        },
        filter:'brightness(250%)',
        particles:{
            speed:0,
            type:0,
        }
    },
    {
        name:'fire',
        mod:{
            speed:1,
            swing:1,
        },
        dot:{
            damage:1,

        },
        filter:'',
        particles:{
            speed:0,
            type:0,
        }
    }
];
function addStatus(status2,duration,target){
    target.statusEffects.push({status:status2,dur:duration});
}
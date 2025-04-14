//Costume pricing:
//30 tokens -> Common      0
//60 tokens -> Rare        1
//120 tokens -> Epic       2
//240 tokens -> Legendary  3

/*
Cost: Cost in tokens (obv)
tokens: if they can be purchased.
rarity: how hard they are to get. 
    0: minor change (color, single item)
    1: decent change (0 but better)
    2: large change (maybe a shape change?)
    3: The most high quality costume!
    4: Extremely hard to get. Usually hidden.
Name: Name obv
desc: Description of the costume. (lore segment)
roll: If they can be obtained from lootboxes
show: If they are shown in the market before you unlock them (secret costumes!!)

bonus: (A boost that can be applied by using the current costume. If you get it from a box when already unlocked, it unlocks the bonus! Can also be purchased for 480 tokens
    desc: Description of the boost
    unlocked: Decides if you need the bonus to be unlocked again after obtaining the costume. Should be false for nearly all costumes
    speed: Speed modifier (multiplier)
    damage: (multiplier, and additive boost)
    health: (multiplier, and additive boost)
    size: Size multiplier. Usually smaller = better
    guard: Guard resistance, and speed (multiplier)
    jab: Jab distance, and speed (multiplier),
    swing: Swing speed (multiplier)



*/



const costumes = [
    {
        cost:0,
        tokens:false,
        rarity:0,
        name:'Blue',
        desc:'The one and only, annoyingly optimistic, the true classic. What can even compete?',
        roll:false,
        show:true,
        
    },
    {
        cost:30,
        tokens:true,
        rarity:0,
        name:'Red',
        desc:'The main antagonist of Duels. This Rook is not particularly a villain, however just has some anger control issues.',
        roll:false,
        show:true,
        bonus:{
            desc:'20% damage increase',
            unlocked:false,
            speed:1,
            damage:{mult:1.2,add:0},
            health:{mult:1,add:0},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:30,
        tokens:true,
        rarity:0,
        name:'Green',
        desc:'One of the colors not yet featured in duels, Green has a skeptical and decisive personality.',
        roll:true,
        show:true,
        bonus:{
            desc:'+5 health',
            unlocked:false,
            speed:1,
            damage:{mult:1,add:0},
            health:{mult:1,add:5},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:30,
        tokens:true,
        rarity:0,
        name:'Yellow',
        desc:'This Little rook is very crazy. But also, slightly mysterious in her actions. What could she be hiding?',
        roll:true,
        show:true,
        bonus:{
            desc:'20% movement speed increase',
            unlocked:false,
            speed:1.2,
            damage:{mult:1,add:0},
            health:{mult:1,add:0},
            size:0.9,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:120,
        tokens:true,
        rarity:2,
        name:'Bionic Rook',
        desc:'This Rook is half robot, half rook. Well, actually 20% Robot, but 50% sounds cooler',
        roll:true,
        show:true,
        bonus:{
            desc:'Swing speed increased by 20%',
            unlocked:false,
            speed:1,
            damage:{mult:1,add:0},
            health:{mult:1,add:0},
            size:1,guard:1,jab:1,swing:1.2,
        },
    },
    {
        cost:60,
        tokens:true,
        rarity:1,
        name:'King Rook',
        desc:'This Rook believes that he is an amazing king, however not only is he not amazing, but he is also not the king. What a dummy',
        roll:true,
        show:true,
        bonus:{
            desc:'Guard effectiveness increase',
            unlocked:false,
            speed:1,
            damage:{mult:1,add:0},
            health:{mult:1,add:0},
            size:1,guard:1.3,jab:1,swing:1,
        },
    },
    {
        cost:120,
        tokens:false,
        rarity:2,
        name:'Reaper Rook',
        desc:'Ambassador of Death himself. The Reaper rook harvests souls for Death, polishes his scythe, and even does his laundry',
        unlock:'Kill 50 enemies',
        roll:false,
        show:true,
        bonus:{
            desc:'20% damage increase',
            unlocked:false,
            speed:1,
            damage:{mult:1.2,add:0},
            health:{mult:1,add:0},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:240,
        tokens:true,
        rarity:3,
        name:'Jelly Rook',
        desc:'This rook leaves behind a residue behind wherever she goes. A sticky residue. Even the Divine One is bothered by it.',
        roll:true,
        show:true,
        bonus:{
            desc:'Jab effectiveness increase',
            unlocked:false,
            speed:1,
            damage:{mult:1,add:0},
            health:{mult:1,add:0},
            size:1,guard:1,jab:1.2,swing:1,
        },
    },
    {
        cost:120,
        tokens:true,
        rarity:2,
        name:'Roock',
        desc:'Strong as a Rook, Smart as a Rock.',
        roll:true,
        show:true,
        bonus:{
            desc:'20% health increase',
            unlocked:false,
            speed:1,
            damage:{mult:1,add:0},
            health:{mult:1.2,add:0},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:60,
        tokens:true,
        rarity:1,
        name:'Baseball',
        desc:'Safe! Or not?',
        roll:true,
        show:true,
        bonus:{
            desc:'10% health and movement speed increase',
            unlocked:false,
            speed:1.1,
            damage:{mult:1,add:0},
            health:{mult:1.1,add:0},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:240,
        tokens:false,
        rarity:3,
        name:'Angel Rook',
        desc:'The servant of the Divine one',
        unlock:'Only obtained from boxes',
        roll:true,
        show:true,
        bonus:{
            desc:'+10 health, but 20% less damage',
            unlocked:false,
            speed:1,
            damage:{mult:0.8,add:0},
            health:{mult:1,add:10},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    {
        cost:99999,
        tokens:false,
        rarity:4,
        name:'DEV',
        desc:'Developer only! Hahaha! No one else should be reading this!',
        unlock:'Cannot be obtained.',
        roll:false,
        show:false,
        bonus:{
            desc:'God Stats. The Dev cannot lose!!',
            unlocked:true,
            speed:1.5,
            damage:{mult:3,add:0},
            health:{mult:3,add:0},
            size:2,guard:2,jab:1.5,swing:1.25,
        },
    },
    {
        cost:9999,
        tokens:false,
        rarity:4,
        name:'World Champion',
        desc:'Only a legend like yourself needs a costume of this high value.',
        unlock:'Only obtained from when you reach the top of the leaderboard',
        roll:false,
        show:false,
        bonus:{
            desc:'15% damage, health, and speed decrease',
            unlocked:true,
            speed:0.85,
            damage:{mult:0.85,add:0},
            health:{mult:0.85,add:0},
            size:1,guard:1,jab:1,swing:1,
        },
    },
    
];
function unlockCostume(i,tokenCost,gemCost){
    let tokenCost = tokenCost || 0;
    let gemCost = gemCost || 0;
    if (saveData.tokens>=tokenCost && saveData.gems>=gemCost){
        saveData.costumes.push(i);
        saveData.tokens-=tokenCost;
        saveData.gems-=gemCost
    }
}

/*
Lore:

This one super-powerful "Divine One" has captured rooks from many worlds and universes. 
They have plotted them to fight each other, not because the Divine One has poor intentions, but because
The 

*/
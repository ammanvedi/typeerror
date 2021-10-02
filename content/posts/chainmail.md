---
publishedUTCISOTimestamp: "2021-02-12T18:00:28+0000"
title: chainmail is silly
slug: chainmail-is-silly
---
The only think I find more annoying than lockdown is chainmail. Or chain-messages as it seems to have evolved to these days.

The main thing that annoys me about chainmail is that its never useful, its always about some whispy notion that is supposed to inspire or make you think but collapses very quickly when given even slight introspection.

Often the content is so loose or its statements are so obvious there is no point forming an argument against it, or its not worth the energy.

But today I received this;


>Very interesting & meaningful msg 2 share:
>
>If:
A = 1 ; B = 2 ; C = 3 ; D = 4 ;
E = 5 ; F = 6 ; G = 7 ; H = 8 ;
I = 9 ; J = 10 ; K = 11 ; L = 12 ;
M = 13 ; N = 14 ; O = 15 ; P = 16 ;
Q = 17 ; R = 18 ; S = 19 ; T = 20 ;
U = 21 ; V = 22 ; W = 23 ; X =24 ;
Y = 25 ; Z = 26
>
> &nbsp;
>
>Then,
>
> &nbsp;
>
>H+A+R+D+W+O+R+K
=8+1+18+4+23+15+18+11
= 98%
>
> &nbsp;
>
>K+N+O+W+L+E+D+G+E
=11+14+15+23+12+5+4+7+5
=96%
>
> &nbsp;
>
>L+O+V+E
= 12+15+22+5
= 54%*
>
> &nbsp;
>
>L+U+C+K ;
=12+21+3+11
= 47%
>
> &nbsp;
>
>None of them makes 100%.
Then what makes 100%?
>
> &nbsp;
>
>Is it Money?
.
.
.
NO!
>
>
>M+O+N+E+Y
= 13+15+14+5+25
=72%
>
> &nbsp;
>
>Leadership?
.
.
.
NO!
>
>
>L+E+A+D+E+R+S+H+I+P
=12+5+1+4+5+18+19+8+9+16
=97%
>
> &nbsp;
>
>Every problem has a solution, only if we perhaps change our
>
>"ATTITUDE"...
>
>A+T+T+I+T+U+D+E ;
1+20+20+9+20+21+4+5
= 100%
>
> &nbsp;
>
>It is therefore OUR ATTITUDE towards Life* *and Work that makes
OUR Life 100% Successful.
>
> &nbsp;
>
>Amazing mathematics

And as an software engineer this seemed like something I can actually have fun with. It sounds like some sort of leetcode problem.

The claim here seems to be that these other words do not equal 100% therefore they cant be the holy grail key to life.

Luckily for us we can get the entire [oxford english dictionary as a json object](https://github.com/cduica/Oxford-Dictionary-Json)

And we can spend 5 minutes writing some code to evaluate this claim;

```javascript
const fs = require('fs');

const dictionaryData = JSON.parse(fs.readFileSync('./dicts.json'))

const words = dictionaryData.map(d => d.word)

const charValues = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9, J: 10, K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17, R: 18, S: 19, T: 20, U: 21, V: 22, W: 23, X: 24, Y: 25, Z: 26
}

const getCountForWord = w => {
    return w.toUpperCase().split('').reduce((sum, c) => sum + charValues[c] , 0)
}

console.time('Runtime')
const oneHundreds = words.filter(w => getCountForWord(w) === 100)
console.timeEnd('Runtime')

console.log(`Total words: ${words.length}`)
console.log(`Words with count totalling 100: ${oneHundreds.length}`);
```
```javascript

$> Runtime: 37.767ms
$> Total words: 58766
$> Words with count totalling 100: 615
```

Before we claim victory there are a couple of fun optimisations we can do here,

First is that we know the maximum value of a character is 26 and that our target is 100, so we know that even if a string has a length of 3 with a maximum value i.e. `ZZZ` it will only amount to 78. So we can exclude any string of length 3 or below

```javascript
const oneHundreds = words.filter(w => w.length > 3 && getCountForWord(w) === 100)
```

This seems to save us about 600 invocations of `getCountForWord` and about `1ms` off the running time which is not that sexy.


Second, we are calculating the full value of the number even when it is over 100. In reality as soon as our counting goes over 100 we dont care what the final count is;

In order to short circuit lets convert the reduce to a `for` loop

```javascript
const getCountForWord = w => {
    //return w.toUpperCase().split('').reduce((sum, c) => sum + charValues[c] , 0)

    let count = 0;
    const wLen = w.length;
    for(let i = 0; i < wLen; i++) {
        const c = w[i];
        count += charValues[c];
        if(count > 100) {
            return count
        }
    }

    return count
}
```

This optimisation is a bit more successful since it allows us to cut the counting short on 26778 occasions and reduces the runtime by about 10ms

```javascript

$> Runtime: 25.500ms
$> Runtime: 23.786ms
$> Runtime: 24.903ms
```  

cool, so back to this stupid chainmail

>A+T+T+I+T+U+D+E ;
1+20+20+9+20+21+4+5
= 100%
>
> &nbsp;
>
>It is therefore OUR ATTITUDE towards Life* *and Work that makes
OUR Life 100% Successful.
>
> &nbsp;
>
>Amazing mathematics

well by this logic here are some other things that will make our life 100% successful


> WHISKING
>
> ANEURISM
>
> TURKEY
>
> FATHERHOOD
>
> SOCIALISM
>
> BOYCOTT

Among 615 words "ATTITUDE" is one, but a special sign from above it is not.

Now please share this article or you will receive 100 years of bad luck.

[code](https://gist.github.com/ammanvedi/16b2ab5d62a9f9957571b51074f041ca)
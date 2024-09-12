The purpose of this article is NOT to mathematically explain how the neural network updates the weights, but to explain the logic behind how the values are being changed in simple terms.

First, we need to know that the Perceptron algorithm states that:

> Prediction (y\`) = 1 if Wx+b > 0 and 0 if Wx+b ≤ 0

Also, the steps in this method are very similar to how Neural Networks learn, which is as follows;

*   Initialize weight values and bias
*   Forward Propagate
*   Check the error
*   Backpropagate and Adjust weights and bias
*   Repeat for all training examples

Now that we know the steps, let’s get up and running:

AND Gate
--------

From our knowledge of logic gates, we know that an AND logic table is given by the diagram below

![](https://miro.medium.com/v2/resize:fit:299/0*9QQhdtqhL6H2yMJ4.gif)

AND Gate

The question is, what are the weights and bias for the AND perceptron?

First, we need to understand that the output of an AND gate is 1 only if both inputs (in this case, x1 and x2) are 1. So, following the steps listed above;

**Row 1**

*   From w1\*x1+w2\*x2+b, initializing w1, w2, as 1 and b as –1, we get;

> x1(1)+x2(1)–1

*   Passing the first row of the AND logic table (x1=0, x2=0), we get;

> 0+0–1 = –1

*   From the Perceptron rule, if Wx+b≤0, then y\`=0. Therefore, this row is correct, and no need for Backpropagation.

**Row 2**

*   Passing (x1=0 and x2=1), we get;

> 0+1–1 = 0

*   From the Perceptron rule, if Wx+b≤0, then y\`=0. This row is correct, as the output is 0 for the AND gate.
*   From the Perceptron rule, this works (for both row 1, row 2 and 3).

**Row 4**

*   Passing (x1=1 and x2=1), we get;

> 1+1–1 = 1

*   Again, from the perceptron rule, this is still valid.

Therefore, we can conclude that the model to achieve an AND gate, using the Perceptron algorithm is;

> x1+x2–1

![](https://miro.medium.com/v2/resize:fit:481/1*TENIyXDCeJNAB8p8_xTfaQ.png)

OR Gate
-------

![](https://miro.medium.com/v2/resize:fit:301/0*Ul09ZJh9XpWoE3dQ.gif)

OR Gate

From the diagram, the OR gate is 0 only if both inputs are 0.

**Row 1**

*   From w1x1+w2x2+b, initializing w1, w2, as 1 and b as –1, we get;

> x1(1)+x2(1)–1

*   Passing the first row of the OR logic table (x1=0, x2=0), we get;

> 0+0–1 = –1

*   From the Perceptron rule, if Wx+b≤0, then y\`=0. Therefore, this row is correct.

**Row 2**

*   Passing (x1=0 and x2=1), we get;

> 0+1–1 = 0

*   From the Perceptron rule, if Wx+b <**\=** 0, then y\`=0. Therefore, this row is incorrect.
*   So we want values that will make inputs x1=0 and x2=1 give y\` a value of 1. If we change w2 to 2, we have;

> 0+2–1 = 1

*   From the Perceptron rule, this is correct for both the row 1 and 2.

**Row 3**

*   Passing (x1=1 and x2=0), we get;

> 1+0–1 = 0

*   From the Perceptron rule, if Wx+b <**\=** 0, then y\`=0. Therefore, this row is incorrect.
*   Since it is similar to that of row 2, we can just change w1 to 2, we have;

> 2+0–1 = 1

*   From the Perceptron rule, this is correct for both the row 1, 2 and 3.

**Row 4**

*   Passing (x1=1 and x2=1), we get;

> 2+2–1 = 3

*   Again, from the perceptron rule, this is still valid. Quite Easy!

Therefore, we can conclude that the model to achieve an OR gate, using the Perceptron algorithm is;

> 2x1+2x2–1

![](https://miro.medium.com/v2/resize:fit:481/1*WJT_08eAz4qpfRuQzEixpg.png)

NOT Gate
--------

![](https://miro.medium.com/v2/resize:fit:167/0*TcSLf0N1vH15lnhf.gif)

NOT Gate

From the diagram, the output of a NOT gate is the inverse of a single input. So, following the steps listed above;

**Row 1**

*   From w1x1+b, initializing w1 as 1 (since single input), and b as –1, we get;

> x1(1)–1

*   Passing the first row of the NOT logic table (x1=0), we get;

> 0–1 = –1

*   From the Perceptron rule, if Wx+b≤0, then y\`=0. This row is incorrect, as the output is 1 for the NOT gate.
*   So we want values that will make input x1=0 to give y\` a value of 1. If we change b to 1, we have;

> 0+1 = 1

*   From the Perceptron rule, this works.

**Row 2**

*   Passing (x1=1), we get;

> 1+1 = 2

*   From the Perceptron rule, if Wx+b > 0, then y\`=1. This row is so incorrect, as the output is 0 for the NOT gate.
*   So we want values that will make input x1=1 to give y\` a value of 0. If we change w1 to –1, we have;

> –1+1 = 0

*   From the Perceptron rule, if Wx+b ≤ 0, then y\`=0. Therefore, this works (for both row 1 and row 2).

Therefore, we can conclude that the model to achieve a NOT gate, using the Perceptron algorithm is;

> –x1+1

![](https://miro.medium.com/v2/resize:fit:481/1*uJ79f0nmqJSup71BRNLQnQ.png)

NOR Gate
--------

![](https://miro.medium.com/v2/resize:fit:297/0*VgvkMDd1E7Z0w69f.gif)

NOR Gate

From the diagram, the NOR gate is 1 only if both inputs are 0.

**Row 1**

*   From w1x1+w2x2+b, initializing w1 and w2 as 1, and b as –1, we get;

> x1(1)+x2(1)–1

*   Passing the first row of the NOR logic table (x1=0, x2=0), we get;

> 0+0–1 = –1

*   From the Perceptron rule, if Wx+b≤0, then y\`=0. This row is incorrect, as the output is 1 for the NOR gate.
*   So we want values that will make input x1=0 and x2 = 0 to give y\` a value of 1. If we change b to 1, we have;

> 0+0+1 = 1

*   From the Perceptron rule, this works.

**Row 2**

*   Passing (x1=0, x2=1), we get;

> 0+1+1 = 2

*   From the Perceptron rule, if Wx+b > 0, then y\`=1. This row is incorrect, as the output is 0 for the NOR gate.
*   So we want values that will make input x1=0 and x2 = 1 to give y\` a value of 0. If we change w2 to –1, we have;

> 0–1+1 = 0

*   From the Perceptron rule, this is valid for both row 1 and row 2.

**Row 3**

*   Passing (x1=1, x2=0), we get;

> 1+0+1 = 2

*   From the Perceptron rule, if Wx+b > 0, then y\`=1. This row is incorrect, as the output is 0 for the NOR gate.
*   So we want values that will make input x1=0 and x2 = 1 to give y\` a value of 0. If we change w1 to –1, we have;

> –1+0+1 = 0

*   From the Perceptron rule, this is valid for both row 1, 2 and 3.

**Row 4**

*   Passing (x1=1, x2=1), we get;

> \-1-1+1 = -1

*   From the Perceptron rule, this still works.

Therefore, we can conclude that the model to achieve a NOR gate, using the Perceptron algorithm is;

> \-x1-x2+1

![](https://miro.medium.com/v2/resize:fit:481/1*J6s7_qPlgYsvF5fj4bF7gQ.png)

NAND Gate
---------

![](https://miro.medium.com/v2/resize:fit:301/0*WnNm2x6gyaXfTBiP.gif)

From the diagram, the NAND gate is 0 only if both inputs are 1.

**Row 1**

*   From w1x1+w2x2+b, initializing w1 and w2 as 1, and b as -1, we get;

> x1(1)+x2(1)-1

*   Passing the first row of the NAND logic table (x1=0, x2=0), we get;

> 0+0-1 = -1

*   From the Perceptron rule, if Wx+b≤0, then y\`=0. This row is incorrect, as the output is 1 for the NAND gate.
*   So we want values that will make input x1=0 and x2 = 0 to give y\` a value of 1. If we change b to 1, we have;

> 0+0+1 = 1

*   From the Perceptron rule, this works.

**Row 2**

*   Passing (x1=0, x2=1), we get;

> 0+1+1 = 2

*   From the Perceptron rule, if Wx+b > 0, then y\`=1. This row is also correct (for both row 2 and row 3).

**Row 4**

*   Passing (x1=1, x2=1), we get;

> 1+1+1 = 3

*   This is not the expected output, as the output is 0 for a NAND combination of x1=1 and x2=1.
*   Changing values of w1 and w2 to -1, and value of b to 2, we get;

> \-1-1+2 = 0

*   It works for all rows.

Therefore, we can conclude that the model to achieve a NAND gate, using the Perceptron algorithm is;

> \-x1-x2+2

![](https://miro.medium.com/v2/resize:fit:481/1*DIvDuAya8-hq3t8gl4IFXA.png)

XNOR Gate
---------

![](https://miro.medium.com/v2/resize:fit:299/0*oGu2x1DA9soE3IdO.gif)

XNOR Gate

Now that we are done with the necessary basic logic gates, we can combine them to give an XNOR gate.

The boolean representation of an XNOR gate is;

> x1x2 + x1\`x2\`

Where ‘\`' means inverse.

From the expression, we can say that the XNOR gate consists of an AND gate (x1x2), a NOR gate (x1\`x2\`), and an OR gate.

This means we will have to combine 3 perceptrons:

*   AND (x1+x2–1)
*   NOR (-x1-x2+1)
*   OR (2x1+2x2–1)

![](https://miro.medium.com/v2/resize:fit:541/1*yZfw_9DRMephzZwejjhyTA.png)

XOR Gate
--------

![](https://miro.medium.com/v2/resize:fit:299/0*W2evx8WUDNHOFeoA.gif)

XOR Gate

The boolean representation of an XOR gate is;

> x1x\`2 + x\`1x2

We first simplify the boolean expression

> x\`1x2 + x1x\`2 + x\`1x1 + x\`2x2
> 
> x1(x\`1 + x\`2) + x2(x\`1 + x\`2)
> 
> (x1 + x2)(x\`1 + x\`2)
> 
> (x1 + x2)(x1x2)\`

From the simplified expression, we can say that the XOR gate consists of an OR gate (x1 + x2), a NAND gate (-x1-x2+1) and an AND gate (x1+x2–1.5).

This means we will have to combine 2 perceptrons:

*   OR (2x1+2x2–1)
*   NAND (-x1-x2+2)
*   AND (x1+x2–1)

![](https://miro.medium.com/v2/resize:fit:541/1*JJPukkeGRunDxIVKaWVsPw.png)

**CONCLUSION**

In conclusion, this is just a custom method of achieving this, there are many other ways and values you could use in order to achieve Logic gates using perceptrons. For example;

> AND (20x1+20x2–30)
> 
> OR (20x1+20x2–10)
> 
> NOT (-20x1+10)

This will still work.


---

[Source](https://medium.com/@stanleydukor/neural-representation-of-and-or-not-xor-and-xnor-logic-gates-perceptron-algorithm-b0275375fea1)
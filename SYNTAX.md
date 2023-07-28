# Basic Instructions
## Functions

<code>appcommand {< code >} </code> - An appcommand or more commonly known as a 'slashcommand'.<br>
<code>prefixcommand {< code >}</code> - A normal prefix command.<br>
<code>login(< token >)</code> - This is where you enter your bot token here.<br>
<code>prefix(< prefix >)</code> - The prefix for your bots prefix commands.<br>
<code>embed(< arguments >)</code> - This is the function used for creating an embed.<br>

## Defining Functions

To define a function we put the visibiltity of the function e.g. <code>public</code> return type of the function e.g. <code>integer</code> then we put the <code>function</code> keyword along with the name.

e.g.
<p>
<code>private string function test() {
  < code >
}</code>
</p>

## Mathematical Operations

Mathmatical operations are done like in any other language <code>decimal/integer operation decimal/integer</code>

e.g. <code>1 + 1</code> or <code>2.2 * -4</code>

<code>+</code> - The addition operator adds two numbers together.<br>
<code>-</code> - The subtraction operator takes away one number from another.<br>
<code>*</code> - The multiplication operator multiplies one number by another.<br>
<code>^</code> - The exponent operator raise one number to the power of another.<br>
<code>/</code> - The division operator divides one number by another.<br>
<code>//</code> - The floor division operator divides one number by another then floors it.<br>
<code>%</code> - The remainder division operator divides one number by another and returns the remainder.<br>

## Variables

<code>constant</code> - Makes the variable unchangeable.
<code>let</code> - Makes the variable changeable.
<code>global</code> - Makes the variable avaiable anywhere in the script.

## Datatypes

<code>unsignedinteger</code> - Can store whole positive numbers. <br>
<code>integer</code> - Can store whole negative or positive numbers. <br>
<code>decimal</code> - Can store any number. <br>
<code>string</code> - Can store any string declared with quotes ("" or ''). <br>
<code>dictionary<datatype></code> Can store a dictionary with string keys that contain values of the specified datatype. <br>
<code>array<datatype></code> Can store an array that contains values of the specified datatype. <br>
<code>any</code> - Can store values of any datatype. <br>

## Example Scripts

<p>
<code>
private integer function test(unsigned integer)
</code>
</p>

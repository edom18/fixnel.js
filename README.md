# fixnel.js

fixnel.jsは、iOSのUIである慣性スクロールを再現したJSです。  
位置固定のfixとpanelを合成した造語です。  

----------------------------------------------------------

fixnel.js give a likes iOS UI with inertia scrolling.  
"fixnel" is combine the word of "fix" and "panel", I created word.

## Syntax
Fixnel(element, [options]);

### Options
{direction: 'which direction'}

directionには文字列で、['vertical' | 'horizontal' | 'both']のいずれかを指定するか、
Fixnel.directionType.[VERTICAL | HORIZONTAL | BOTH]のいずれかを指定します。
デフォルトはverticalです。

----------------------------------------------------------

Options takes one object as argument. One of options is "direction". That is given a string. Whichever are ['vertical' | 'horizontal' | 'both'].
You also can use Fixnel.directionType property. It contains [VERTICAL | HORIZONTAL | BOTH].
Default is "vertical".


## Example
`var ele = document.getElementById('[target ID]');`

//only vertical  
`var fixnel = new Fixnel(ele);`

//only horizontal  
`var fixnel = new Fixnel(ele, {
    direction: Fixnel.directionType.HORIZONTAL
});`

//both  
`var fixnel = new Fixnel(ele, {
    direction: Fixnel.directionType.BOTH
});`

### instance method.
`fixnel.moveTo(x, y[, opt]);`

moveToメソッドは、指定されたx, yの座標に移動します。  
もしオプションとして{animate: false}を指定すると、アニメーションなしで即座にその場に移動します。

----------------------------------------------------------

fixnel move to [x, y].  
If you give an opt, you can control moving. opt has one property. It is "animate". If you give it to "false", moveTo method move to [x, y] without animation.

### Events

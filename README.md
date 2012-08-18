# fixnel.js

fixnel.jsは、iPhoneのUIである慣性スクロールを再現したJSです。  
位置固定のfixとpanelを合成した造語です。  
現状ではまだ縦スクロールにしか対応していません。  
さらにまだバグがあるので、とりあえずの公開です。

## Syntax
Fixnel(element, [options]);

### Options
{direction: 'which direction'}

directionには文字列で、['vertical' | 'horizontal' | 'both']のいずれかを指定するか、
Fixnel.directionType.[VERTICAL | HORIZONTAL | BOTH]のいずれかを指定します。
デフォルトはverticalです。

## Example
var ele = document.getElementById('[target ID]');

//only vertical
var fixnel = new Fixnel(ele);

//only horizontal
var fixnel = new Fixnel(ele, {
    direction: Fixnel.directionType.HORIZONTAL
});

//both
var fixnel = new Fixnel(ele, {
    direction: Fixnel.directionType.BOTH
});

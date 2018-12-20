Поскольку у анта нельзя просто так выдернуть цвета. 
Так как Ант использует Less  в нутри котрого чистый JS 
придется сделать ряд монипуляций 

1) перйти в эту папку
2) выплонить команду ``lessc --js --strict-imports   get_all_value.less var.css``
3) копируем содержимое var.css > colors.styl 
4) форматируем содержание мултиселекстом blue-1: #d3ebea; -> $blue-1 = #d3ebea;


простой компилятор less -> stylus
https://codepen.io/mikesmullin/pen/poFDj

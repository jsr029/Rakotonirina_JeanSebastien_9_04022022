# [Bug Report] - Bills

## Description

Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge.

## Done : https://github.com/jsr029/Rakotonirina_JeanSebastien_P9_04022022/blob/master/Bill-app/Billed-app-FR-Front/src/__tests__/Bills.js line 38

Déja expliqué précédemment

# [Bug report] - Login

## Description

Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge (cf. copie d'écran).

## Done : https://github.com/jsr029/Rakotonirina_JeanSebastien_P9_04022022/blob/master/Bill-app/Billed-app-FR-Front/containers/Login.js lines 45, 46

Remplacer "employee" par "admin", déja expliqué précédemment.

# [Bug Hunt] - Dashboard

## Description

Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste. 

L'intervention se situe donc dans le fichier https://github.com/jsr029/Rakotonirina_JeanSebastien_P9_04022022/blob/master/Bill-app/Billed-app-FR-Front/src/containers/Dashboard.js 
L'idée est de faire en sorte que lorsqu'on déplie une liste les 2 autres dropdown se ferment. ce qui donne :

      switch(this.index){
        case 1 : 
        $(`#arrow-icon${2}`).css({ transform: 'rotate(90deg)'})
        $(`#status-bills-container${2}`).html("")
        $(`#arrow-icon${3}`).css({ transform: 'rotate(90deg)'})
        $(`#status-bills-container${3}`).html("")
        this.counter ++
        break;
        case 2 : 
        $(`#arrow-icon${1}`).css({ transform: 'rotate(90deg)'})
        $(`#status-bills-container${1}`).html("")
        $(`#arrow-icon${3}`).css({ transform: 'rotate(90deg)'})
        $(`#status-bills-container${3}`).html("")
        this.counter ++
        break;
        case 3 : 
        $(`#arrow-icon${1}`).css({ transform: 'rotate(90deg)'})
        $(`#status-bills-container${1}`).html("")
        $(`#arrow-icon${2}`).css({ transform: 'rotate(90deg)'})
        $(`#status-bills-container${2}`).html("")
        this.counter ++
        break;
      }

# [Ajout de tests unitaires et d'intégration]

Le rapport de couverture de branche de Jest indique que le fichiers suivants ne sont pas couverts (cf. copie d'écran) :

- [ ]  composant views/Bills : Le taux de couverture est à 100% néanmoins si tu regardes le premier test il manque la mention “expect”. Ajoute cette mention pour que le test vérifie bien ce que l’on attend de lui.
- [x]  composant  views/NewBill
- [ ]  composant container/Bills :
    - [ ]  couvrir un maximum de  "statements" c'est simple, il faut qu’après avoir ajouté tes tests unitaires et d’intégration  [le rapport de couverture du fichier container/Bills](http://127.0.0.1:8080/coverage/lcov-report/containers/Bills.js.html) soit vert. Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".
    - [ ]  ajouter un test d'intégration GET Bills. Tu peux t'inspirer de celui qui est fait (signalé en commentaires) pour Dashboard.
- [ ]  composant container/NewBill :
    - [ ]  couvrir un maximum de "statements" : c'est simple, il faut que le rapport de couverture du fichier container/NewBill soit vert (accessible à [cette adresse](http://127.0.0.1:8080/coverage/lcov-report/containers/NewBill.js.html) quand tu auras lancé le serveur). Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".
    - [ ]  ajouter un test d'intégration POST new bill.
- [x]  composant views/VerticalLayout

Respecter la structure des tests unitaires en place : Given  / When / Then avec le résultat attendu. Un exemple est donné dans le squelette du test __tests__/Bills.js

# 1. Composant view/Bills
https://github.com/jsr029/Rakotonirina_JeanSebastien_P9_04022022/blob/master/Bill-app/Billed-app-FR-Front/src/__tests__/Bills.js lines 29, 30

      //to-do write expect expression
      expect(windowIcon).toBeTruthy()



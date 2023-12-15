

### 1. Uruchomić backend i frontend, oraz bazydanych. To oczywiste, ale dla pewności sprawdzić też ten punkt.
### 2. [JUŻ NIEAKTUALNE] Na backendzie w pliku app.module.ts tymczasowo (na czas testów) zakomentowujemy linijkę 35:<br/> `{ provide: APP_GUARD, useClass: JwtAuthGuard },`
### 3. Uruchomić mailslurper z tej wersji https://github.com/mailslurper/mailslurper/releases/tag/1.14.1
   Po prostu ściągnąć, rozpakować folder i uruchomić plik mailslurper.exe,
   uruchomi się okienko wiersza poleceń z kilkoma linijkami logów - to jest właśnie ten mailslurper.<br/>
   WAŻNE - nazwa tego okienka to ścieżka, pod którą mailslurper.exe się znajduje, ale przy uruchomieniu ta nazwa jest poprzedzona czasem słowem "Wybierz" (np. WybierzC:\Users\itd...). Wtedy należy kliknąć gdzieś w tym okienku, wcisnąć "enter" (słowo "Wybierz" zniknie z nazwy okienka), i dopiero potem je zminimalizować. Program działa sobie w tle.
### 4. Sprawdzenie czy mailslurper działa. Wchodzimy na http://localhost:8080 i widzimy interfejs mailslurpera - działa. Jeśli nie, spradzić czy port 8080 nie jest zablokowany. Trzeba też spradzić port 8085. Kiedy wejdziemy na adres http://localhost:8085 w przeglądarce, powinno nam wyświetlić JSONa {"message":"Not Found"}
### 5. W Insomnii uruchamiamy http://localhost:3001/user/admin na metodzie POST aby stworzyć profil admina.
### 6. Wchodzimy w przeglądarce na adres frontu i logujemy się na admina: (email: admin@admin.com hasło: admin1)
### 7. Importujemy listę kursantów z pliku .csv
Przykładowa zawartość pliku .csv można skopiować, wkleić w jakimś edytorze tekstowym i zapisać jako .csv
(uwaga - w pliku .md dodałem `<br/>` żeby wyświetlało poprawnie na podglądzie - kopiować z podglądu)
email;courseCompletion;courseEngagement;projectDegree;teamProjectDegree;bonusProjectUrls<br/>
aaa@test.pl;3.5;2;5;3;https://megak.pl<br/>
bbb@test.pl;3.5;2;5;3;www.bbb.pl<br/>
ccc@test.pl;3.5;2;5;3;www.ccc.com<br/>
ddd@test.pl;3.5;2;5;3;www.ddd.de<br/>
eee@test.pl;3.5;2;5;3;https://eeej.ni<br/>
fff@test.pl;3.5;2;5;3;www.fafafafa.fr<br/>
ggg@test.pl;3.5;2;5;3;www.google.com<br/>
hhh@test.pl;3.5;2;5;3;https://hahaha.ha<br/>
jjj@test.pl;3.5;2;5;3;www.jajo.po<br/>
kkk@test.pl;3.5;2;5;3;www.kot.it<br/>
#### w tym momencie mamy w bazie danych uzupełnione tabele "Users" oraz "StudentInitial" o dane naszych studentów oraz rozesłane zostały emaile.
### 8. Wchodzimy na interfejs mailslurpera (przz http://localhost:8080) i otwieramy jednego z emaili.
### 9. Kopiujemy link aktywacyjny z tego emaila
Np. `http://localhost:3001/user/activate/1ed2e45b-bb4e-4176-a1c6-d87f7= 232c240/bdc07655-9760-11ee-9906-309c2381f43b`
#### UWAGA! treści tych emaili są zniekształcane przez emaila, dlatego w linkach jest zawsze błąd: dodatkowa spacja i znak równości. Poprawny link (przykładowy) powinien wyglądać tak<br/> `http://localhost:3001/user/activate/1ed2e45b-bb4e-4176-a1c6-d87f7232c240/bdc07655-9760-11ee-9906-309c2381f43b`<br/> Dlatego musimy poszukać w linku tego znaku równości i spacji '= ' i je skasować wklejając w przeglądarkę.
### 10. Po uruchomieniu w przeglądarce poprawnie wklejonego linka nastąpi aktywacja oraz przekierowanie na stronę logowania, a w bazie danych zostanie ustawiony status użytkownika na aktywny oraz wyczyszczony token aktywacyjny.
### 11. Logujemy się na konto aktywowanego kursanta przy pomocy jego emaila oraz tymczasowego hasła podanego w powyższym emailu. 
## W podobny sposób możemy aktywować też profil HR, tylko na początku w panelu admin trzeba wpisać dane rekrutera i zatwierdzić, wtedy przyjdzie email z danymi aktywacyjnymi — aktywujemy i logujemy się tak samo, jak w przypadku kursanta.


### Trzeba wziąć pod uwagę, że kiedy mailslurper zostanie zrestartowany, emaile z hasłami mogą przepaść. Wtedy cały proces trzeba powtórzyć, aby przeprowadzić nowe testy. Można też te hasła z emaili sobie zapisać i używać (o ile dane w bazie danych się nie zmienią). Jeśli natomiast coś się zmieni w bazie danych lub chcemy testować na innych danych, trzeba wszystkie dane z tabel usunąć. Najlepiej robić to przez usuwanie całych tabel; można przez drop table, ale ja robię to w Heidi; klikam na bazę megak_headhunter w lewym okienku, wtedy w prawym pojawiają mi się tabele, zaznaczam je i PPM wybieram 'usuń'.
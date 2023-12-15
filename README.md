# MegaK HeadHunter v3 gr.2

Aplikacja pozwala w prosty sposób łączyć osoby z działów HR firm, w tym Headhunterów, z osobami poszukującymi pracy w IT.

### Przydatne linki

[Dokumentacja api](https://github.com/ligrys-dev/megak-v3-headhunter-be-gr2/blob/develop/api-documentation.md) <br/>
[Uruchomienie środowiska testowego krok po kroku](https://github.com/ligrys-dev/megak-v3-headhunter-be-gr2/blob/develop/run-test-documentation.md)

### Kluczowe cechy:

- #### Admin:
  - dodawanie pliku csv z danymi inicjalizacyjnymi kursantów
  - rejestracja rekruterów
- #### Kursant:
  - dodanie i edycja profilu
  - wyświetlanie CV
  - zaznaczenie przez kursanta, że został zatrudniony
- #### Rekruter:
  - Wyświetlanie listy dostępnych studentów
  - Wybieranie kursantów do rozmowy na osobną listę
  - Odrzucanie niewybranych studentów
- #### User
  - aktywacja profilu poprzez link, wysyłany na maila
  - zmiana hasła
  - odzyskiwanie
  - logowanie i autoryzacja

## Wykorzystane technologie:

- backend
  - nodejs
  - Nest.js
  - typeorm
  - mySQL
  - typescript
  - bcrypt
  - passport.js
  - jwt
  - multer
  - papaparse
  - nodemailer
  - class validator, class transformer
- frontend
  - react
  - react-router
  - react-hook-form
  - typescript
  - vite
  - papaparse
  - react-icons

## Uruchomienie aplikacji lokalnie

### Backend

stwórz katalog z projektem np.:

```
mkdir megak_headhunter
```

przejdź do tego katalogu i pobierz kod z repozytorium

```
cd ./megak_headhunter
```

```
git clone https://github.com/ligrys-dev/megak-v3-headhunter-be-gr2.git
```

```
cd ./megak-v3-headhunter-be-gr2
```

edytuj pliki konfiguracyjne:

- .env.example -> zmień nazwę na .env i ustaw swoje wartości zmiennych środowiskowych

otwórz phpMyAdmin albo innego klienta SQL i stwórz bazę danych zgodną z nazwą z pliku .env

```
npm install
nest start --watch
```

### Frontend

```
cd ~/megak_headhunter
git clone https://github.com/ligrys-dev/megak-v3-headhunter-fe-gr2.git
cd ./megak-v3-headhunter-fe-gr2
npm install
npm run dev
```

# Data Discovery Dashboard
A hobby project for listing down data in a paginatable grid view.

Demo to this project is available on [Vercel](https://data-discovery-dashboard.vercel.app/).

## Objectives
1. Fetch list of data from an exposed API endpoint.
2. Display the API response in a grid.
3. Infinite scrolling to paginate down the list.
4. Ability to multi-select data in the list.
5. A simple delete simulation for removing the selected data out of the state, with action confirmation to prevent accidental deletion.
6. Implement state management with React Context API (state, reducer, provider, etc.)
7. Simulate a loading scenario using setTimeout(), and implement loading screen using skeletons.
8. Perform useEffect clean-ups with callbacks, and fetch clean-ups with the AbortController interface.
9. Static typing and code certainty with TypeScript
10. Implement basic CSS styling and responsive rules using TailwindCSS

## Architecture
 ### Tech Stack
1. React/Next (via `yarn create-app`)
2. React Context API for state management (`Zustand` or `Redux` are great but for a small project like this might be overkill)
3. Next API for backend

 ### Design Pattern
 Here I showcase the basic implementation of the [**Atomic**](https://bradfrost.com/blog/post/atomic-web-design/) design pattern.
 
 Inside the project, smaller and re-usable components are further broken down into their own components. The goal is to make the app more modular, flexible, and to strengthen the separation of concerns (SoC).
 
 Inside the project, these smaller components are found within `./components` folder, particularly within the following sub-folders:
 
 - `atoms/`
 - `organisms/`
 - `molecules/`
 
 
 I also created a `utils/` folder to modularize common and potentially re-usable functionalities such as string manipulation, etc.

 Still inside `./components/utils/` folder, I created `contexts/` which contains all the base files for state management purposes.

### Static Data

Another folder is`./components/data/` which contains all the static data we should have. Here we have the `companies.json` which is our primary mock data for the project. We can further enhance the whole app to fetch from a real data source such as an SQLite database, a NoSQL source, or even from a RDB. I strongly recommend to use [**Prisma**](https://www.prisma.io/) in this case to take advantage of the power of ORM.

 ### Lazy Loading

 Lazy loading is showcase to one of the components called CompanyList. Using React lazy and Suspense, this component is loaded only when needed.
 
## Preparation & Installation

Feel free to downgrade or upgrade based on your needs, but for this project, I used the following:

- `yarn` 1.22.19
- `node` 20.18.0
- `react` 18
- `next` 14.2.15
- `tailwindcss` 3.4.1
- 


#### Clone Project
First, clone the [**project**](https://github.com/michaeljarizala/data-discovery-dashboard.git).
```
$ git clone https://github.com/michaeljarizala/data-discovery-dashboard.git
```

Next, install the project in your machine

```
$ yarn install
```
> **NOTE:**
> If you prefer, you may also use the `npm` command - feel free to substitute it with `yarn`. But for simplicity of this documentation, I will use Yarn as the reference from hereon.
> ```
> $ npm install
> ```
> 
> 

Once above command is successful, then voila! The project is now ready - quite simple right?

## Running the App

Now let's test that it is indeed working.

Let us first perform linting to make sure everything is written as it was.

```
$ yarn lint

✔ No ESLint warnings or errors
✨  Done in 8.04s.
```

If there are no linting errors, we are now ready to build our project.

```
$ yarn build

  ▲ Next.js 14.2.15

 ✓ Linting and checking validity of types    
   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Collecting page data    
 ✓ Generating static pages (3/3)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (pages)                             Size     First Load JS
┌ ○ /                                     3.16 kB        81.2 kB
├   /_app                                 0 B              78 kB
├ ○ /404                                  180 B          78.2 kB
├ ƒ /api/companies                        0 B              78 kB
└ ƒ /api/hello                            0 B              78 kB
+ First Load JS shared by all             81.3 kB
  ├ chunks/framework-64ad27b21261a9ce.js  44.8 kB
  ├ chunks/main-e5e349bb2d39155a.js       32.1 kB
  └ other shared chunks (total)           4.29 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

✨  Done in 8.14s.
```

Awesome, it built successfully without errors! Let's run it and see.

```
$ yarn start

▲ Next.js 14.2.15
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 252ms
```

It's running as expected. Open `http://localhost:3000` on your browser.

> **NOTE:**
> On development, simply run the `dev` command and you may begin tweaking the code and see your changes as you do them.
> ```
> $ yarn dev
> ```
>

## Screenshots
##### Dashboard (loading state)
![image Dashboard loading state](https://img001.prntscr.com/file/img001/JS2E_wwNQ3GHa3PSJwykxw.png)
##### Dashboard (loaded state)
![image Dashboard loaded state](https://img001.prntscr.com/file/img001/blbQUu9tRt-L2YMEjtCk_g.png)
##### Dashboard (empty state)
![image Dashboard empty state](https://img001.prntscr.com/file/img001/44K9MXzGR6ioHojTvHBiQw.png)
##### Dashboard (multi selection)
![image Dashboard multi selection](https://img001.prntscr.com/file/img001/gx_qR3L9QDmr6s9pBzBzvw.png)
##### Dashboard (delete confirmation)
![image Dashboard delete confirmation](https://img001.prntscr.com/file/img001/AD1ZTkwmRbO-aqF8PTfpng.png)

### And there you go! You have successfully ran the app at this point.
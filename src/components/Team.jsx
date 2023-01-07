import { TeamProvider, useTeam } from "./Store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "@tanstack/react-location";
import { useState } from "react";
const queryClient = new QueryClient();
const location = new ReactLocation();
const SearchBox = () => {
  const { search, setSearch } = useTeam();
  return (
    <input
      type="text"
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-800 focus:ring-indigo-800 focus:outline-none sm:text-lg p-2 mx-auto max-w-7xl"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};
const Pagination = ({ postPerPage, setCurrentPage, currentPage }) => {
  const { team } = new useTeam();
  let pages = [];
  const [pagesNumberLimit, setPagesNumberLimit] = useState(5);
  const [maxNumberLimit, setMaxNumberLimit] = useState(5);
  const [minpagesNumberLimit, setMinPagesNumberLimit] = useState(0);
  for (let i = 1; i <= Math.ceil(team.length / postPerPage); i++) {
    pages.push(i);
  }
  const handleNext = () => {
    if (currentPage != pages.length) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 > maxNumberLimit) {
        setMaxNumberLimit(maxNumberLimit + pagesNumberLimit);
        setMinPagesNumberLimit(minpagesNumberLimit + pagesNumberLimit);
      }
    }
  };
  const handlePrev = (e) => {
    if (currentPage != 1) {
      setCurrentPage(currentPage - 1);
      if ((currentPage - 1) % pagesNumberLimit == 0) {
        setMaxNumberLimit(maxNumberLimit - pagesNumberLimit);
        setMinPagesNumberLimit(minpagesNumberLimit - pagesNumberLimit);
      }
    } else {
      e.preventDefault();
    }
  };
  const number = pages.map((e, i) => {
    if (e < maxNumberLimit + 1 && e > minpagesNumberLimit) {
      return (
        <button
          key={i}
          className="px-2 bg-red-400 rounded-md"
          onClick={() => setCurrentPage(e)}
        >
          {e}
        </button>
      );
    }
  });
  return (
    <div className="text-center space-x-2 text-xl">
      <button onClick={handlePrev} className="px-2 bg-red-400 rounded-md">
        Prev
      </button>
      {number}
      <button onClick={handleNext} className="px-2 bg-red-400 rounded-md">
        Next
      </button>
    </div>
  );
};
const TeamList = () => {
  const { team } = useTeam();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(8);
  let lastPostIndex = currentPage * postPerPage;
  let firstPostIndex = lastPostIndex - postPerPage;
  const data = team.slice(firstPostIndex, lastPostIndex);
  if (!team.length) {
    return (
      <div className="pt-2">
        <p className="font-semibold text-center py-5 border border-black rounded-md mx-auto max-w-7xl">
          Team Not Found!
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="text-center font-bold font-serif text-2xl">
        Premier League
      </div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-3 mb-2 mx-auto max-w-7xl">
        {data.map((e) => (
          <Link key={e.team.id} to={`/team/${e.team.id}`}>
            <li
              key={e.team.id}
              className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
            >
              <div className="flex-1 flex flex-col p-8">
                <img
                  className="w-32 h-32 flex-shrink-0 mx-auto  rounded-md"
                  src={e.team.logo}
                  alt="teamImage"
                />
                <h3 className="mt-6 text-gray-900 text-sm font-medium">
                  {e.team.name}
                </h3>
                <h3 className="mt-6 text-gray-900 text-sm ">{e.team.code}</h3>
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <Pagination
        postPerPage={postPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};

function TeamDetails() {
  const {
    params: { id },
  } = useMatch();
  const { team } = useTeam();

  const teamData = team.find((e) => e.team.id === +id);
  if (!teamData) {
    return <div>team Not Founded !</div>;
  }
  return (
    <div className="mt-3 mx-auto max-w-4xl">
      <Link to="/">
        <h1 className="text-2xl font-bold mb-5">&lt; Home</h1>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 ">
        <img
          className="w-96 h-96 flex-shrink-0 mx-auto  rounded-md"
          src={teamData.venue.image}
          alt=""
        />
        <div className="ml-3">
          <h2 className="text-2xl font-bold">{teamData.team.name}</h2>
          <div className="mt-3">
            <h3 className="text-xl font-bold">Venue</h3>
            <ul className="mt-3">
              {["name", "address", "city", "capacity", "surface"].map(
                (state) => (
                  <li key={state} className="grid grid-cols-2">
                    <span className="font-bold">{state}</span>
                    <span className="font-semibold">
                      {teamData.venue[state]}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <div className="font-bold text-center py-3">
      Made with
      <span className="text-red-500">Love</span>
      by Ibrahim <span className="block">FreeCodeCamp</span>
    </div>
  );
}

const Team = () => {
  const routes = [
    {
      path: "/",
      element: (
        <>
          <SearchBox />
          <TeamList />
          <Footer />
        </>
      ),
    },
    {
      path: "/team/:id",
      element: (
        <>
          <TeamDetails />
          <Footer />
        </>
      ),
    },
  ];
  return (
    <QueryClientProvider client={queryClient}>
      <TeamProvider>
        <Router location={location} routes={routes}>
          <div className="">
            <Outlet />
          </div>
        </Router>
      </TeamProvider>
    </QueryClientProvider>
  );
};
export default Team;

import React from "react";

const Developers = () => {
  return (
    <div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full mb-24 pt-40 rounded-md">
        <div className="rounded-lg bg-white shadow p-20 flex justify-center flex-auto">
          <div className="py-6 ">
            <h2 className="text-3xl font-bold text-center text-gray-600">
              AlgoFi
            </h2>
            <div className="mt-8 max-w-md ">
              <form className="justify-center">
                <div className="grid gap-6 mb-6 md:grid-cols-2  justify-center">
                  <div className="">
                    <label
                      for="first_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="">
                    <label
                      for="last_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <label
                  for="email"
                  className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                  Email address
                </label>
                <div className="relative mb-6">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    for="text"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white after:content-['*'] after:ml-0.5 after:text-red-500"
                  >
                    Title
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Linear Regression"
                    required
                  />
                </div>
                <div className="block mb-4">
                  <div className="mt-2">
                    <label
                      for="text"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Choose the ML file
                    </label>
                    <div class="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            aria-hidden="true"
                            class="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span class="font-semibold">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            .csv or any other format
                          </p>
                        </div>
                        <input id="dropzone-file" type="file" class="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <button
                    type="submit"
                    className="text-white col-span-3  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-gradient-to-r  from-[#0014FF] via-[#362FD9] to-[#3A1078] hover:from-[#2F58CD] hover:via-[#6C00FF] hover:to-[#0A2647]"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;

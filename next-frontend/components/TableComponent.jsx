import React from "react";

const TableComponent = () => {
  return (
    <div class="scale-100 hover:scale-105 transition ease-in delay-10 cursor-pointer relative overflow-x-auto shadow-md sm:rounded-lg mx-20">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Blockchain
            </th>
            <th scope="col" class="px-6 py-3">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Polygon
            </th>
            <td class="px-6 py-4">$1000</td>
          </tr>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Aave
            </th>
            <td class="px-6 py-4">$1003</td>
          </tr>
          <tr class="bg-white dark:bg-gray-800">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Optimism
            </th>
            <td class="px-6 py-4">$996</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

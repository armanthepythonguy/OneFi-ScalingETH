import { Accordion } from "flowbite-react";
import React from "react";
import { useRef, useEffect } from "react";

const Accordian = () => {
  return (
    <div className="bg-white mx-40 my-20 rounded-lg">
      <Accordion collapseAll={true}>
        <Accordion.Panel>
          <Accordion.Title>Lorem ipsum is placeholder text</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>Lorem ipsum is placeholder text</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>Lorem ipsum is placeholder text</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Learn more about these technologies:
            </p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default Accordian;

// const ref = useRef(null);

// useEffect(() => {
//   // create an array of objects with the id, trigger element (eg. button), and the content element
//   const accordionItems = [
//     {
//       id: "accordion-example-heading-1",
//       triggerEl: ref.current,
//       targetEl: ref.current,
//       active: true,
//     },
//     {
//       id: "accordion-example-heading-2",
//       triggerEl: ref.current,
//       targetEl: ref.current,
//       active: false,
//     },
//     {
//       id: "accordion-example-heading-3",
//       triggerEl: ref.current,
//       targetEl: ref.current,
//       active: false,
//     },
//   ];

//   // options with default values
//   const options = {
//     alwaysOpen: true,
//     activeClasses:
//       "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
//     inactiveClasses: "text-gray-500 dark:text-gray-400",
//     onOpen: (item) => {
//       console.log("accordion item has been shown");
//       console.log(item);
//     },
//     onClose: (item) => {
//       console.log("accordion item has been hidden");
//       console.log(item);
//     },
//     onToggle: (item) => {
//       console.log("accordion item has been toggled");
//       console.log(item);
//     },
//   };

//   /*
//    * accordionItems: array of accordion item objects
//    * options: optional
//    */
//   const accordion = new Accordion(accordionItems, options);
// }, []);

// return (
//   <div className="mx-40 my-20 bg-white rounded-[15px]">
//     <div id="accordion-collapse" data-accordion="collapse">
//       <h2 id="accordion-collapse-heading-1" ref={ref}>
//         <button
//           type="button"
//           className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//           data-accordion-target="#accordion-collapse-body-1"
//           aria-expanded="true"
//           aria-controls="accordion-collapse-body-1"
//         >
//           <span>Lorem ipsum is placeholder text</span>
//           <svg
//             data-accordion-icon
//             className="w-6 h-6 rotate-180 shrink-0"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fill-rule="evenodd"
//               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//         </button>
//       </h2>
//       <div
//         id="accordion-collapse-body-1"
//         className="hidden"
//         aria-labelledby="accordion-collapse-heading-1"
//         ref={ref}
//       >
//         <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <p className="mb-2 text-gray-500 dark:text-gray-400">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//             enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//           <p className="text-gray-500 dark:text-gray-400">
//             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//         </div>
//       </div>
//       <h2 id="accordion-collapse-heading-2" ref={ref}>
//         <button
//           type="button"
//           className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//           data-accordion-target="#accordion-collapse-body-2"
//           aria-expanded="false"
//           aria-controls="accordion-collapse-body-2"
//         >
//           <span>Lorem ipsum is placeholder text</span>
//           <svg
//             data-accordion-icon
//             className="w-6 h-6 shrink-0"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fill-rule="evenodd"
//               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//         </button>
//       </h2>
//       <div
//         id="accordion-collapse-body-2"
//         className="hidden"
//         aria-labelledby="accordion-collapse-heading-2"
//         ref={ref}
//       >
//         <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
//           <p className="mb-2 text-gray-500 dark:text-gray-400">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//             enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//           <p className="text-gray-500 dark:text-gray-400">
//             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//         </div>
//       </div>
//       <h2 id="accordion-collapse-heading-3" ref={ref}>
//         <button
//           type="button"
//           className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//           data-accordion-target="#accordion-collapse-body-3"
//           aria-expanded="false"
//           aria-controls="accordion-collapse-body-3"
//         >
//           <span>Lorem ipsum is placeholder text</span>
//           <svg
//             data-accordion-icon
//             className="w-6 h-6 shrink-0"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fill-rule="evenodd"
//               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//         </button>
//       </h2>
//       <div
//         id="accordion-collapse-body-3"
//         className="hidden"
//         aria-labelledby="accordion-collapse-heading-3"
//         ref={ref}
//       >
//         <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700 bg-white ">
//           <p className="mb-2 text-gray-500 dark:text-gray-400">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//             enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//           <p className="mb-2 text-gray-500 dark:text-gray-400">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//             enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//           <p className="mb-2 text-gray-500 dark:text-gray-400">
//             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

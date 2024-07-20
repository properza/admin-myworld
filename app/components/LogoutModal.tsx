import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";

interface LogoutModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function LogoutModal({
  isModalOpen,
  setIsModalOpen,
}: LogoutModalProps): JSX.Element {
  const cancelButtonRef = useRef(null);

  return (
    <div className="z-10">
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setIsModalOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div className="sm:flex sm:flex-col">
                    <div className="sm:flex gap-3 pb-3 items-center">
                      <img
                        src="/images/logout.svg"
                        alt="Logout"
                        draggable="false"
                        className="h-6 w-6"
                      />

                      <Dialog.Title
                        as="h3"
                        className="text-lg font-bold leading-6 text-gray-900"
                      >
                        Logout
                      </Dialog.Title>
                    </div>

                    <p>Are you sure you want to log out</p>
                  </div>

                  <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <form action="/logout" method="post">
                      <button
                        type="submit"
                        className="flex w-11 h-11 px-3 py-2 justify-center items-center gap-[10px] self-stretch rounded-md bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Logout
                      </button>
                    </form>

                    <button
                      type="button"
                      className="flex h-11 w-11 px-3 py-2 justify-center items-center gap-[10px] self-stretch rounded-md bg-[#6c6c6c] text-sm font-semibold text-white shadow-sm ring-1 ring-inset0 sm:mt-0 sm:w-auto"
                      onClick={() => setIsModalOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default LogoutModal;

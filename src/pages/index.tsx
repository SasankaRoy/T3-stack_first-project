import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Avatar from "react-avatar";
import { useState } from "react";

const Home: NextPage = () => {
  const [EditArticle, setEditArticle] = useState();
  const [addPopup, setAddPopup] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { data, isLoading } = api.newArticle.getAll.useQuery();

  const deleteArticleReq = api.newArticle.deleteArticle.useMutation({
    onSuccess(data) {
      if (data?.error) {
        window.alert(data.error);
      } else {
        window.alert(data.success);
      }
    },
  });

  /* This code block is checking the authentication status of the user using the `useSession` hook from
 the `next-auth/react` library. If the session status is "loading", it returns a loading message. If
 the session status is "unauthenticated", it redirects the user to the sign-in page using the
 `useRouter` hook from the `next/router` library. If the session status is authenticated, it logs
 the user object to the console. */

  if (sessionStatus === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#000]/50">
        <h2 className="text-xl font-normal tracking-wide text-white">
          A few seconds Authenticating...
        </h2>
      </div>
    );
  } else if (sessionStatus === "unauthenticated") {
    // I can use any one of these functions
    // to redirect the user if he / she is not authenticated...

    // router.push("/signin");
    signIn();
  }

  // edit function...
  const editArticle = (id: { id: string; title: string; content: string }) => {
    setAddPopup(true);
    setEditArticle(id);
  };

  // delete function...
  const deleteArticle = async (id: string) => {
    deleteArticleReq.mutate({ id });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative h-screen overflow-y-auto scroll-smooth">
        <div className="mx-auto flex w-[90%] items-center justify-between rounded bg-gray-100  p-2">
          <h1 className="text-xl font-semibold capitalize tracking-wider">
            welcome,back{" "}
            <span className="text-blue-500">{session?.user.name}</span>
          </h1>
          <h1 className="text-3xl font-normal capitalize tracking-wider underline">
            DemoProject
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <Avatar name={session?.user.name} size="50" round={true} />
            <h3>{session?.user.email}</h3>
            <button
              className="rounded-md bg-red-400 px-3 py-1 text-lg font-normal tracking-wide text-white shadow"
              onClick={() => {
                signOut({
                  redirect: false,
                });
                router.push("/signin");
              }}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="h-full w-full">
          <div className="mx-auto flex w-[90%] items-center justify-around py-3">
            <h2 className="text-2xl font-normal capitalize tracking-wide">
              Articles
            </h2>
            <button
              onClick={() => setAddPopup(true)}
              className="rounded-xl border px-3 py-1 text-lg font-normal tracking-wide shadow"
            >
              ➕ Add
            </button>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-5 px-3 md:grid-cols-2 lg:grid-cols-3">
            {data?.length > 0 ? (
              data?.map((cur, id) => (
                <div
                  key={id}
                  className="rounded-lg bg-gray-50 px-4 py-3 shadow"
                >
                  <h1 className="text-2xl font-semibold capitalize tracking-wide">
                    {cur.title}
                  </h1>
                  <p className="mt-3 text-base font-normal tracking-wide">
                    {cur.content}
                  </p>
                  <div className="mt-3 flex items-center justify-around">
                    <button
                      onClick={() => editArticle(cur)}
                      className="rounded-md border bg-blue-300 px-3 py-1 text-xl font-normal tracking-wide"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteArticle(cur.id)}
                      className="rounded-md border bg-red-300 px-3 py-1 text-xl font-normal tracking-wide"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center ">
                <h1 className="text-xl font-normal tracking-wide text-gray-400">
                  NO data found! Create a new articles
                </h1>
              </div>
            )}
          </div>
        </div>
        {addPopup && (
          <AddArticlePopup
            setAddPopup={setAddPopup}
            userSession={session}
            EditArticle={EditArticle}
            setEditArticle={setEditArticle}
          />
        )}
      </main>
    </>
  );
};

export default Home;

const AddArticlePopup = ({
  setAddPopup,
  userSession,
  EditArticle,
  setEditArticle,
}) => {
  const [newArticle, setNewArticle] = useState({
    email: userSession?.user.email,
    title: EditArticle?.title ? EditArticle.title : "",
    dec: EditArticle?.content ? EditArticle.content : "",
  });

  // create article statr ...
  /* This code block is defining a mutation function using the `useMutation` hook from the
        `api.newArticle` object. The mutation function is called `newArticle` and it takes an object with
        `email`, `title`, and `dec` properties as its input. */
  const newAeticleReq = api.newArticle.newArticle.useMutation({
    onSuccess(data) {
      if (data?.error) {
        window.alert(data.error);
      } else {
        window.alert(data.success);
        setAddPopup(false);
      }
    },
  });

  // ........... create article end

  // edit article start........

  const editAeticleReq = api.newArticle.editArticle.useMutation({
    onSuccess(data) {
      if (data?.error) {
        window.alert(data.error);
      } else {
        window.alert(data.success);
        setAddPopup(false);
      }
    },
  });
  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  // ...... edit article end

  // the handleSubmit(button) function and the useState() is common to both newArticle and createArticle........

  const handleSubmit = async (e: any) => {
    if (e.target.innerHTML == "Add") {
      const { email, title, dec } = newArticle;
      newAeticleReq.mutate({ email, title, dec });
    } else {
      const { title, dec } = newArticle;
      editAeticleReq.mutate({ id: EditArticle.id, title, dec });
    }
  };

  return (
    <div className="fixed top-0 flex h-full w-full items-center justify-center bg-[#000]/50">
      <div className="relative h-[57%] w-[50%] rounded-md bg-white p-5 shadow-md">
        <h2 className="font-sembold  text-center text-xl tracking-wide">
          {EditArticle ? "Edit" : "Add"} Article.
        </h2>
        <div className="mx-auto mt-2 w-[80%] bg-gray-50 p-3">
          <div className="flex flex-col items-start justify-start space-y-2">
            <label
              htmlFor="title"
              className="text-lg font-normal tracking-wide"
            >
              Title
            </label>
            <input
              type="text"
              placeholder="enter title.."
              name="title"
              value={newArticle.title}
              onChange={handleOnChange}
              className="text-md w-full border-b-2 bg-transparent py-1 font-medium outline-none"
            />
          </div>
          <div className="flex flex-col items-start justify-start space-y-2">
            <label
              htmlFor="decribtion"
              className="text-lg font-normal tracking-wide"
            >
              Decribtion
            </label>
            <textarea
              type="text"
              name="dec"
              value={newArticle.dec}
              onChange={handleOnChange}
              placeholder="enter decribtion.."
              rows="6"
              className="text-md  w-full border-b-2 bg-transparent font-medium outline-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 rounded-xl bg-blue-300 px-5 py-2 text-xl font-normal tracking-wide shadow"
          >
            {EditArticle ? "Edit" : "Add"}
          </button>
        </div>
        <span
          onClick={() => {
            setAddPopup(false);
            setNewArticle({ email: "", title: "", dec: "" });
            setEditArticle("");
          }}
          className="absolute -right-2 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white p-1"
        >
          ✖️
        </span>
      </div>
    </div>
  );
};

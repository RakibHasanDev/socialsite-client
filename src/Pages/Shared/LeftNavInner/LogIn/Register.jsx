import { GoogleAuthProvider } from "firebase/auth";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const Register = ({ setIsModal, isModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const imgbb = process.env.REACT_APP_imgbb_key;
  const googleProvider = new GoogleAuthProvider();

  const { createUser, updateUser, googleUser, verifyUser, loading } =
    useContext(AuthContext);

  const onSubmit = (data) => {
    // console.log(data);
    const image = data.photo[0];
    // console.log(image);
    const formData = new FormData();
    formData.append("image", image);
    // console.log(formData);
    const url = `https://api.imgbb.com/1/upload?key=${imgbb}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgbb) => {
        if (imgbb.success) {
          //   console.log(imgbb);
          createUser(data.email, data.password)
            .then((result) => {
              const user = result.user;
              //   console.log(user);
              const userInfo = {
                displayName: data.name,
                photoURL: imgbb.data.url,
              };
              updateUser(userInfo)
                .then((result) => {
                  //   console.log(userInfo);
                  toast.success("Account Created Successfully");
                  verifyUser().then(() => {
                    saveUser(data.name, data.email, userInfo.photoURL);
                    toast.success("Verify Email sent, Check your spam folder");
                  });
                  reset();
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        }
      });
  };

  const googleHandler = () => {
    googleUser(googleProvider)
      .then((result) => {
        const user = result.user;
        saveGoogleUser(user.displayName, user.emaigil, user.photoURL);
        console.log(user);
      })
      .catch((err) => console.error(err));
  };

  const saveUser = (
    userName,
    userEmail,
    userPhoto,
    university = "",
    address = "",
    Phone = "",
    Birthday = "",
    Gender = ""
  ) => {
    const user = {
      userName,
      userEmail,
      userPhoto,
      university,
      address,
      Phone,
      Birthday,
      Gender,
    };
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const saveGoogleUser = (
    userName,
    userEmail,
    userPhoto,
    university = "",
    address = "",
    Phone = "",
    Birthday = "",
    Gender = ""
  ) => {
    const user = {
      userName,
      userEmail,
      userPhoto,
      university,
      address,
      Phone,
      Birthday,
      Gender,
    };
    fetch("http://localhost:5000/users", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("save-user = google", data);
        if (data.acknowledged) {
          toast.success(`Google Login Successful, 'Email' = ${user.email}`);

          // navigate(from, { replace: true });
        }
      });
  };

  //   if (loading) {
  //   return <div>auth register loading...</div>
  // }
  return (
    <>
      <div className="w-full p-8 space-y-3 rounded-xl  text-gray-800">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-1 text-sm">
            <label htmlFor="Name" className="block text-lg text-gray-400">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is require" })}
              id="Name"
              placeholder="Name"
              className="w-full px-4 py-3 rounded-md text-lg border-gray-200 focus:outline-none bg-white text-gray-900"
            />
            {errors.name && (
              <p
                role="alert"
                className="text-red-800 text-[15px] font-semibold"
              >
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-lg text-gray-400">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="email"
              className="w-full px-4 py-3 rounded-md text-lg border-gray-200 focus:outline-none bg-white text-gray-900"
            />
            {errors.email && (
              <p
                role="alert"
                className="text-red-800 text-[15px] font-semibold"
              >
                {errors.email?.message}
              </p>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="photo" className="block text-lg text-gray-400">
              Photo
            </label>
            <input
              type="file"
              {...register("photo", { required: "Image is Required" })}
              id="photo"
              className="file-input bg-white file-input-bordered file-input-ghost w-full"
            />
            {errors.photo && (
              <p
                role="alert"
                className="text-red-800 text-[15px] font-semibold"
              >
                {errors.photo?.message}
              </p>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block text-lg text-gray-400">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password Is Required" })}
              id="password"
              placeholder="password"
              className="w-full px-4 py-3 rounded-md text-lg border-gray-200 focus:outline-none bg-white text-gray-900"
            />
            {errors.password && (
              <p
                role="alert"
                className="text-red-800 text-[15px] font-semibold"
              >
                {errors.password?.message}
              </p>
            )}
          </div>

          {!loading ? (
            <button className="block w-full p-3 text-center rounded-sm text-lg text-gray-900 bg-violet-400 modal-action">
              Sign Up
            </button>
          ) : (
            <div className="w-full p-3 rounded-sm bg-violet-400">
              <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-white mx-auto"></div>
            </div>
          )}
        </form>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 bg-gray-700"></div>
          <p className="px-3 text-md text-gray-800">
            Login with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 bg-gray-700"></div>
        </div>
        <div className="my-6 space-y-4">
          <button
            aria-label="Login with Google"
            type="button"
            className="flex items-center justify-center w-full p-4 space-x-4 border rounded-md hover:bg-gray-800 transition-colors duration-700 hover:text-gray-200 border-gray-800"
            onClick={googleHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-current"
            >
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
            </svg>
            <p>Login with Google</p>
          </button>
        </div>
        <p className="text-sm text-center sm:px-6 text-gray-500">
          Already have an account?
          <span
            rel="noopener noreferrer"
            className="underline text-gray-800 cursor-pointer"
            onClick={() => setIsModal(!isModal)}
          >
            Sign In
          </span>
        </p>
      </div>
    </>
  );
};

export default Register;

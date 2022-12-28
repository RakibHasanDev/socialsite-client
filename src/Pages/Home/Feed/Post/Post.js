import React, { useContext } from "react";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { AiFillPlusCircle } from "react-icons/ai";

const Post = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <label htmlFor="post" className="block">
        <div className="flex justify-between items-center w-full bg-gray-100 rounded-full">
          <div className="flex justify-center items-center">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src={user?.photoURL} alt="" className="p-3 rounded-full" />
              </div>
            </div>
            <div>
              <p className="text-gray-600">What's on your mind.</p>
            </div>
          </div>
          <div className="pr-2">
            <AiFillPlusCircle className="text-4xl text-blue-800 cursor-pointer" />
          </div>
        </div>
      </label>
    </div>
  );
};

export default Post;

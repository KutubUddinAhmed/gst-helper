import { Link } from "react-router-dom";

function SignupPage() {
  return (
    <div className="flex justify-center items-center w-full  bg-gray-200/20 backdrop-blur-lg ">
      <div className="w-full p-3 bg-white/20  shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create an Account
        </h2>
        <form className="space-y-2">
          <div className="flex w-full items-center justify-between gap-2">
            {/* First Name */}

            <div className="flex-1">
              <label
                htmlFor="first_name"
                className="block text-sm  text-gray-600"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="px-3 w-full py-1.5 mt-1 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-600"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="w-full px-4 py-1.5 mt-1 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-1.5 mt-1 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-1.5 mt-1 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-4 py-1.5 mt-1 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select your role</option>
              <option value="admin">Vendor</option>
              {/* <option value="user">User</option>
              <option value="vendor">Vendor</option> */}
            </select>
          </div>

          {/* Created By */}
          <div>
            <label
              htmlFor="created_by"
              className="block text-sm font-medium text-gray-600"
            >
              Created By
            </label>
            <input
              type="text"
              id="created_by"
              className="w-full px-4 py-1.5 mt-1 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter creator's name"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Switch to Login */}
        <p className="mt-3 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

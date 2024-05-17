/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { BsPersonFillAdd } from 'react-icons/bs'
import { BiImages } from 'react-icons/bi'
import NoProfile from '../assets/userprofile.png'
import { Link } from 'react-router-dom'
import CustomButton from '../components/CustomButton'
import ProfileCard from '../components/ProfileCard'
import FriendsCard from '../components/FriendsCard'
import TextInput from '../components/TextInput'
import { useForm } from 'react-hook-form'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/userSlice/userSlice'
import { singleFileValidator } from '../utils/validators'
import { toast } from 'react-toastify'
import { createPostAPI, uploadFilePostAPI } from '../redux/postSlice/postSlice'
import { accectFriendRequestAPI, deletePostAPI, friendRequestAPI, getFriendRequestAPI, getPostsAPI, likePostAPI, suggestedFriendsAPI } from '../common'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [friendRequest, setFriendRequest] = useState([])
  const [suggestedFriends, setSuggestedFriends] = useState([])
  const [file, setFile] = useState(null)

  const user = useSelector(selectCurrentUser)

  const dispatch = useDispatch()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' })

  /**
   * Hàm debounce nhận hai tham số: callback là hàm cần debounce và delay là thời gian chờ (3 giây trong trường hợp này).
    Bên trong hàm, một biến timerId được sử dụng để lưu trữ ID của bộ hẹn giờ.
    Khi hàm debounce được gọi, nếu timerId đã tồn tại, nghĩa là một yêu cầu API đang chờ được thực thi. Lúc này, bộ hẹn giờ cũ sẽ bị xóa bằng clearTimeout(timerId).
    Sau đó, một bộ hẹn giờ mới được tạo ra bằng setTimeout. Sau delay mili giây (3 giây), hàm callback sẽ được thực thi và timerId được đặt lại thành null.
   */

  const debounce = (callback, delay) => {
    let timerId
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        callback(...args)
        timerId = null
      }, delay)
    }
  }

  const getPosts = async () => {
    await getPostsAPI()
      .then(res => {
        const newData = [...res]
        setPosts(newData)
      })
      .catch(err => console.log(err))
  }

  const onSubmitPost = async (data) => {
    const newPost = file ? { ...data, image: file } : data

    toast.promise(
      dispatch(createPostAPI(newPost)),
      { pending: 'Uploading...' }
    ).then(res => {
      if (!res.error) {
        toast.success('Post created successfully!')
        setFile(null)
        getPosts()
        reset({
          description: ''
        })
      }
    })

  }
  const handleFileUpload = (e) => {
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    setFile(e.target?.files[0])
    const formData = new FormData()
    formData.append('image', e.target?.files[0])

    toast.promise(
      dispatch(uploadFilePostAPI(formData)),
      { pending: 'Uploading...' }
    ).then(res => {
      if (!res.error) {
        toast.success('Upload File successfully!')
        setFile(res.payload.image)
      }
      e.target.value = ''
    })
  }

  const handleLikePost = async (id) => {
    await likePostAPI(id)
    await getPosts()
  }

  const fetchSuggestedFriends = async () => {
    await suggestedFriendsAPI()
      .then(data => {
        setSuggestedFriends(data)
      })
      .catch(err => console.log(err))
  }

  const handleFriendRequest = debounce( async (id) => {
    // Thực hiện yêu cầu API tại đây
    await friendRequestAPI({ requestTo: id })

  }, 2000)

  const fetchFriendRequests = async () => {
    await getFriendRequestAPI()
      .then(data => {
        setFriendRequest(data)
      })
      .catch(error => console.log(error))
  }

  const acceptFriendRequest = async (rid, status) => {
    try {
      await accectFriendRequestAPI({ status, rid })
        .then(() => {
          fetchFriendRequests()
        })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    await deletePostAPI(id)
      .then(() => {
        getPosts()
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getPosts()
    fetchSuggestedFriends()
    fetchFriendRequests()
  }, [])


  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-5 md:pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <Header/>
        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>

          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto md:pl-4 lg:pl-0'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
            <form
              className='bg-primary px-4 rounded-lg'
              onSubmit={handleSubmit(onSubmitPost)}
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.avatar ?? NoProfile}
                  alt='User Image'
                  className='w-14 h-14 rounded-full object-cover'
                />
                <TextInput
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind...."
                  name='description'
                  register={register('description', {
                    required: 'Write something about post'
                  })}
                  error={!!errors['description']}
                />
              </div>

              <div className='flex items-center justify-between py-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    onChange={handleFileUpload}
                    className='hidden'
                    id='imgUpload'
                    data-max-size='5120'
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <CustomButton
                  type='submit'
                  title='Post'
                  containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
                />
              </div>
            </form>

            {
              file ? (
                <div className="w-full bg-primary shadow-sm py-6 ">
                  <img src={`${file}`} className="object-cover h-48 w-96 mx-auto"/>
                </div>
              ) :
                <div className="w-full bg-primary shadow-sm">
                </div>
            }

            <div className='block md:hidden'>
              <ProfileCard user={user} />
            </div>
            {
              posts?.length > 0 ? (
                posts?.map((post) => (
                  <PostCard
                    post={post}
                    getPosts={getPosts}
                    key={post?._id}
                    user={user}
                    deletePost={handleDelete}
                    likePost={handleLikePost}
                  />
                ))
              ) : (
                <div className='flex w-full h-full items-center justify-center'>
                  <p className='text-lg text-ascent-2'>No Post Available</p>
                </div>
              )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REEQUESTS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest.map(({ _id, requestFrom: from }, index) => (
                  <div
                    className='flex items-center justify-between'
                    key={index + _id}
                  >
                    <Link
                      to={'/profile/' + from._id}
                      key={from?._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={from?.avatar ?? NoProfile}
                        alt={from?.displayName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {from?.profession ?? 'No Profession'}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        onClick={() => acceptFriendRequest(_id, 'Accepted')}
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                      <CustomButton
                        title='Deny'
                        onClick={() => acceptFriendRequest(_id, 'Denied')}
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-xl rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends.map((friend, index) => (
                  <div
                    className='flex items-center justify-between'
                    key={index + friend?._id}
                  >
                    <Link
                      to={'/profile/' + friend?._id}
                      key={friend?._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.avatar ?? NoProfile}
                        alt={friend?.displayName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.displayName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? 'No Profession'}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => handleFriendRequest(friend?._id)}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {edit && <EditProfile />} */}
    </>
  )
}

export default Home

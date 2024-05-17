import moment from 'moment'
import { Link } from 'react-router-dom'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import NoProfile from '../assets/userprofile.png'

const ReplyCard = ({ reply, user, handleLike }) => {
  return (
    <div className='w-full py-3' key={reply?._id}>
      <div className='flex gap-3 items-center mb-1'>
        <Link to={'/profile/' + reply?.userId?._id}>
          <img
            src={reply?.userId?.avatar ?? NoProfile}
            alt={reply?.userId?.displayName}
            className='w-10 h-10 rounded-full object-cover'
          />
        </Link>
        <div>
          <Link to={'/profile/' + reply?.userId?._id}>
            <p className='font-medium text-base text-ascent-1'>
              {reply?.userId?.displayName}
            </p>
          </Link>
          <span className='text-ascent-2 text-sm'>
            {moment(reply?.createdAt ?? '2023-05-25').fromNow()}
          </span>
        </div>
      </div>

      <div className='ml-12'>
        <p className='text-ascent-2 '>{reply?.comment}</p>

        <div className='mt-2 flex gap-6'>
          <p
            className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'
            onClick={handleLike}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color='blue' />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReplyCard


import CustomButton from './CustomButton'
import { useForm } from 'react-hook-form'
import TextInput from './TextInput'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/userSlice/userSlice'
import { commentPostAPI, replyPostCommentAPI } from '../common'

const CommentForm = ({ id, replyAt, getComments }) => {
  const user = useSelector(selectCurrentUser)


  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' })

  const onSubmit = async (data) => {

    const newData = {
      comment: data?.comment,
      from: user?.displayName,
      replyAt: replyAt
    }
    const res = !replyAt ? await commentPostAPI(id, newData) : await replyPostCommentAPI(id, newData)

    getComments(res._id)
  }


  return (
    <form
      className='w-full border-b border-[#66666645]'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-full flex items-center gap-2 py-4 '>
        <img
          src={user?.avatar}
          alt='User Image'
          className='w-10 h-10 rounded-full object-cover'
        />

        <TextInput
          name='comment'
          styles='w-full rounded-full py-3'
          placeholder={replyAt ? `Reply @${replyAt}` : 'Comment this post'}
          register={register('comment', {
            required: 'Comment can not be empty'
          })}
          error={!!errors['comment']}
        />
      </div>
      <div className='flex items-end justify-end pb-2'>
        <CustomButton
          title='Submit'
          type='submit'
          containerStyles='bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm'
        />
      </div>
    </form>
  )
}

export default CommentForm

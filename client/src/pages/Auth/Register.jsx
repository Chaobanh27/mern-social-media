import { TbSocial } from 'react-icons/tb'
import { ImConnection } from 'react-icons/im'
import { BsShare } from 'react-icons/bs'
import { AiOutlineInteraction } from 'react-icons/ai'
import TextInput from '../../components/TextInput'
import CustomButton from '../../components/CustomButton'
import { useForm } from 'react-hook-form'
import BgImg from '../../assets/img.jpeg'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FieldErrorAlert from '../../components/FieldErrorAlert'
import { registerUserAPI } from '../../common'

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Registration is in progress...' }
    ).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }

  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6 2xl:py-10'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-full py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full px-6 lg:p-10 2xl:px-20 flex flex-col justify-center'>
          <div className='w-full flex gap-2 items-center mb-3 2xl:mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <TbSocial />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold'>
              ShareFun
            </span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>
            Create your account
          </p>

          <form
            className='py-4 2xl:py-8 flex flex-col gap-3 2xl:gap-6'
            onSubmit={handleSubmit(submitRegister)}
          >

            <TextInput
              name='email'
              label='Email Address'
              placeholder='email@example.com'
              type='email'
              register={register('email', {
                required: 'Email Address is required!'
              })}
              styles='w-full'
              error={!!errors['email']}
            />
            <FieldErrorAlert errors={errors} fieldName={'email'} />


            <TextInput
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              styles='w-full'
              register={register('password', {
                required: 'Password is required!'
              })}
              error={!!errors['password']}
            />
            <FieldErrorAlert errors={errors} fieldName={'password'} />

            <TextInput
              label='Confirm Password'
              placeholder='Password'
              type='password'
              styles='w-full'
              register={register('password_confirmation', {
                validate: (value) => {
                  if (value === watch('password')) return true
                  return 'Password Confirmation does not match!'
                }
              })}
              error={!!errors['password_confirmation']}
            />
            <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />


            <CustomButton
              type='submit'
              containerStyles={'interceptor-loading inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none mt-5 2xl:mt-8'}
              title='Create Account'
            />
          </form>

          <p className='text-ascent-2 text-sm text-center'>
            Already has an account?{' '}
            <Link
              to='/login'
              className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
            >
              Login
            </Link>
          </p>
        </div>
        {/* RIGHT */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
          <div className='relative w-full flex  items-center justify-center'>
            <img
              src={BgImg}
              alt='Bg Image'
              className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
            />
            <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
              <BsShare size={14} />
              <span className='text-xs font-medium'>Share</span>
            </div>
            <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
              <ImConnection />
              <span className='text-xs font-medium'>Connect</span>
            </div>
            <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
              <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <p className='text-white text-base'>
              Connect with friedns & have share for fun
            </p>
            <span className='text-sm text-white/80'>
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

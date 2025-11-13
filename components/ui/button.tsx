interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg'
  }
  
  export function Button({ size = 'md', className = '', ...props }: ButtonProps) {
    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-md',
      lg: 'px-6 py-3 text-lg',
    }
    return <button className={`${sizes[size]} rounded bg-blue-500 text-white ${className}`} {...props} />
  }
  
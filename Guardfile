# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'livereload' do
  watch(%r{public/.+\.(css|js|html)})
  # Rails Assets Pipeline
  watch(%r{public(/.+\.(?:css|js))\.\w+}) { |m| "/#{m[1]}" }
end

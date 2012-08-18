SRC = src/fixnel.js

COMBINE = src/fixnel.prod.js
COMPRESS = src/fixnel.min.js
 
$(COMBINE) : $(SRC)
	cat $^ > $@

	java -jar /Applications/gcc/compiler.jar --js $(COMBINE) --js_output_file $(COMPRESS)
 
.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)

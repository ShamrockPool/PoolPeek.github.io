import React from 'react';
import PropTypes from 'utils/propTypes';

import classNames from 'classnames';

import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

const IconWidget = ({
  bgColor,
  icon: Icon,
  iconProps,
  title,
  subtitle,
  className,
  ...restProps
}) => {
  const classes = classNames('cr-widget', className, {
    [`bg-${bgColor}`]: bgColor,
  });
  return (


    <Card inverse className={classes} {...restProps}>

      <CardBody>
      <Icon size={4} {...iconProps} />
        <CardTitle style={{
                      alignContent: 'center', justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}><small>{title}</small></CardTitle>
        <CardSubtitle>{subtitle}</CardSubtitle>
      </CardBody>
    </Card>



  );
};

IconWidget.propTypes = {
  bgColor: PropTypes.string,
  icon: PropTypes.component,
  iconProps: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

IconWidget.defaultProps = {
  bgColor: 'primary',
  icon: 'span',
  iconProps: { size: 28 },
};

export default IconWidget;
